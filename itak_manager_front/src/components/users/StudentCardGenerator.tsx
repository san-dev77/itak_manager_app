import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  X,
  Download,
  Printer,
  QrCode,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import QRCode from "qrcode";
import { useReactToPrint } from "react-to-print";
import { type StudentWithUser } from "../../services/api";
import Button from "../ui/Button";
import logoItak from "../../assets/logo itak.png";

interface StudentCardGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentWithUser | null;
  redirectUrl?: string; // URL vers laquelle rediriger quand le QR code est scanné
}

const StudentCardGenerator: React.FC<StudentCardGeneratorProps> = ({
  isOpen,
  onClose,
  student,
  redirectUrl = "https://itak.edu", // URL par défaut
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Configuration de react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Carte_etudiante_${student?.user.firstName}_${student?.user.lastName}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
  });

  const generateQRCode = useCallback(async () => {
    if (!student) return;

    setIsGenerating(true);
    try {
      // Créer un objet JSON avec toutes les informations de l'étudiant
      const studentData = {
        id: student.id,
        name: `${student.user.firstName} ${student.user.lastName}`,
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        email: student.user.email,
        matricule: student.matricule || "",
        enrollmentDate: student.enrollmentDate,
        address: student.address || "",
        emergencyContact: student.emergencyContact || "",
        fatherName: student.fatherName || "",
        motherName: student.motherName || "",
        tutorName: student.tutorName || "",
        tutorPhone: student.tutorPhone || "",
        maritalStatus: student.maritalStatus || "",
        notes: student.notes || "",
        redirectUrl: redirectUrl,
      };

      const qrData = JSON.stringify(studentData);

      const qrCodeUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: "#1e40af", // Bleu foncé
          light: "#ffffff", // Blanc
        },
        errorCorrectionLevel: "H", // Niveau de correction d'erreur élevé
      });

      setQrCodeDataUrl(qrCodeUrl);
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [student, redirectUrl]);

  // Générer le QR code
  useEffect(() => {
    if (student && isOpen) {
      generateQRCode();
    }
  }, [student, isOpen, generateQRCode]);

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Non renseigné";
    try {
      return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Date invalide";
    }
  };

  const handleDownload = async () => {
    if (cardRef.current && student) {
      try {
        // Créer un canvas manuellement pour éviter les problèmes de styles
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Impossible de créer le contexte canvas");
        }

        // Dimensions de la carte (format carte de crédit à 300 DPI)
        const cardWidth = 1016; // 85.6mm à 300 DPI
        const cardHeight = 640; // 54mm à 300 DPI
        canvas.width = cardWidth;
        canvas.height = cardHeight;

        // Fond bleu dégradé
        const gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
        gradient.addColorStop(0, "#1e40af");
        gradient.addColorStop(1, "#3b82f6");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, cardWidth, cardHeight);

        // Logo ITAK (carré blanc avec texte)
        const logoSize = 80;
        const logoX = 30;
        const logoY = 30;

        ctx.fillStyle = "white";
        ctx.fillRect(logoX, logoY, logoSize, logoSize);

        // Texte ITAK dans le logo
        ctx.fillStyle = "#1e40af";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("ITAK", logoX + logoSize / 2, logoY + logoSize / 2);

        // Titre "Carte Étudiant"
        ctx.fillStyle = "white";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "right";
        ctx.fillText("Carte Étudiant", cardWidth - 30, 50);
        ctx.font = "14px Arial";
        ctx.fillText("2024-2025", cardWidth - 30, 70);

        // Nom de l'étudiant
        ctx.fillStyle = "white";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(
          `${student.user.firstName} ${student.user.lastName}`,
          30,
          150
        );

        // Informations de l'étudiant
        ctx.font = "18px Arial";
        ctx.fillText(`Matricule: ${student.matricule || "N/A"}`, 30, 200);
        ctx.fillText(`Email: ${student.user.email}`, 30, 230);
        ctx.fillText(
          `Inscription: ${formatDate(student.enrollmentDate)}`,
          30,
          260
        );

        // QR Code si disponible
        if (qrCodeDataUrl) {
          const qrSize = 120;
          const qrX = cardWidth - qrSize - 30;
          const qrY = 150;

          // Fond blanc pour le QR code
          ctx.fillStyle = "white";
          ctx.fillRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);

          // Charger et dessiner le QR code
          const qrImg = new Image();
          qrImg.onload = () => {
            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

            // Footer
            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(
              "Étudiant à Institut Technique 'l'Antidote' de Kati (ITAK)",
              cardWidth / 2,
              cardHeight - 20
            );

            // Télécharger l'image
            const link = document.createElement("a");
            link.download = `carte-etudiant-${student.user.firstName}-${student.user.lastName}.png`;
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();
          };
          qrImg.src = qrCodeDataUrl;
        } else {
          // Footer même sans QR code
          ctx.fillStyle = "white";
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.fillText(
            "Étudiant à Institut Technique 'l'Antidote' de Kati (ITAK)",
            cardWidth / 2,
            cardHeight - 20
          );

          // Télécharger l'image
          const link = document.createElement("a");
          link.download = `carte-etudiant-${student.user.firstName}-${student.user.lastName}.png`;
          link.href = canvas.toDataURL("image/png", 1.0);
          link.click();
        }
      } catch (error) {
        console.error("Erreur lors du téléchargement:", error);
        alert("Erreur lors du téléchargement de la carte");
      }
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Génération de carte étudiante
                </h2>
                <p className="text-blue-100 text-sm">
                  {student.user.firstName} {student.user.lastName}
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="p-2 bg-white/10 hover:bg-white/20 border-white/30 text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Aperçu de la carte */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Aperçu de la carte
                </h3>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowBack(false)}
                    variant={!showBack ? "primary" : "outline"}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <RotateCw className="w-3 h-3" />
                    Recto
                  </Button>
                  <Button
                    onClick={() => setShowBack(true)}
                    variant={showBack ? "primary" : "outline"}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Verso
                  </Button>
                </div>
              </div>

              {/* Carte étudiante */}
              <div className="flex justify-center">
                <div
                  ref={cardRef}
                  className="card-container relative"
                  style={{
                    width: "85.6mm",
                    height: "54mm",
                    borderRadius: "8px",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.6s",
                    transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Recto de la carte */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                      color: "white",
                      backfaceVisibility: "hidden",
                      position: "relative",
                    }}
                  >
                    {/* Filigrane ITAK */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) rotate(-15deg)",
                        fontSize: "80px",
                        fontWeight: "900",
                        color: "rgba(255, 255, 255, 0.1)",
                        zIndex: 1,
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      UPCD ITAK
                    </div>
                    <div
                      className="card-content"
                      style={{
                        padding: "12px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        position: "relative",
                      }}
                    >
                      {/* Header avec logo et titre */}
                      <div
                        className="card-header"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          className="logo"
                          style={{
                            width: "32px",
                            height: "32px",
                            background: "white",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "4px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          }}
                        >
                          <img
                            src={logoItak}
                            alt="ITAK"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            textAlign: "right",
                            lineHeight: "1.2",
                          }}
                        >
                          <div>Carte Étudiant</div>
                          <div style={{ fontSize: "8px", opacity: 0.9 }}>
                            2024-2025
                          </div>
                        </div>
                      </div>

                      {/* Informations principales */}
                      <div
                        className="student-main-info"
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {/* Informations de l'étudiant */}
                        <div
                          className="student-info"
                          style={{
                            flex: 1,
                            marginRight: "12px",
                          }}
                        >
                          <div
                            className="student-name"
                            style={{
                              fontSize: "14px",
                              fontWeight: "bold",
                              marginBottom: "6px",
                              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                            }}
                          >
                            {student.user.firstName} {student.user.lastName}
                          </div>
                          <div
                            className="student-details"
                            style={{
                              fontSize: "9px",
                              lineHeight: "1.4",
                              opacity: 0.95,
                            }}
                          >
                            <div
                              style={{
                                marginBottom: "4px",
                                background: "rgba(255, 255, 255, 0.15)",
                                padding: "3px 6px",
                                borderRadius: "3px",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "600",
                                  fontSize: "8px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.3px",
                                  opacity: 0.9,
                                }}
                              >
                                Matricule
                              </span>
                              <div
                                style={{ fontSize: "8px", marginTop: "1px" }}
                              >
                                {student.matricule || "N/A"}
                              </div>
                            </div>
                            <div
                              style={{
                                marginBottom: "4px",
                                background: "rgba(255, 255, 255, 0.15)",
                                padding: "3px 6px",
                                borderRadius: "3px",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "600",
                                  fontSize: "8px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.3px",
                                  opacity: 0.9,
                                }}
                              >
                                Email
                              </span>
                              <div
                                style={{ fontSize: "8px", marginTop: "1px" }}
                              >
                                {student.user.email}
                              </div>
                            </div>
                            <div
                              style={{
                                background: "rgba(255, 255, 255, 0.15)",
                                padding: "3px 6px",
                                borderRadius: "3px",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "600",
                                  fontSize: "8px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.3px",
                                  opacity: 0.9,
                                }}
                              >
                                Inscription
                              </span>
                              <div
                                style={{ fontSize: "8px", marginTop: "1px" }}
                              >
                                {formatDate(student.enrollmentDate)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* QR Code */}
                        {qrCodeDataUrl && (
                          <div
                            className="qr-code"
                            style={{
                              width: "60px",
                              height: "60px",
                              background: "white",
                              borderRadius: "6px",
                              padding: "4px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                            }}
                          >
                            <img
                              src={qrCodeDataUrl}
                              alt="QR Code"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Footer avec nom de l'institut */}
                      <div
                        style={{
                          fontSize: "6px",
                          opacity: 0.9,
                          textAlign: "center",
                          marginTop: "4px",
                          fontWeight: "500",
                          letterSpacing: "0.3px",
                          lineHeight: "1.1",
                        }}
                      >
                        Étudiant à Institut Technique 'l'Antidote' de Kati
                        (ITAK)
                      </div>
                    </div>
                  </div>

                  {/* Verso de la carte */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                      color: "#1e40af",
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      position: "relative",
                    }}
                  >
                    {/* Filigrane ITAK */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) rotate(-15deg)",
                        fontSize: "80px",
                        fontWeight: "900",
                        color: "rgba(30, 64, 175, 0.08)",
                        zIndex: 1,
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      UPCD ITAK
                    </div>
                    <div
                      className="card-content"
                      style={{
                        padding: "12px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      {/* Header verso */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            color: "#1e40af",
                          }}
                        >
                          Informations détaillées
                        </div>
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            background: "#1e40af",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "2px",
                          }}
                        >
                          <img
                            src={logoItak}
                            alt="ITAK"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              filter: "brightness(0) invert(1)",
                            }}
                          />
                        </div>
                      </div>

                      {/* Informations détaillées */}
                      <div
                        style={{
                          flex: 1,
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                          fontSize: "6px",
                          lineHeight: "1.3",
                          marginBottom: "4px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <div
                            style={{
                              background: "rgba(30, 64, 175, 0.1)",
                              padding: "4px 6px",
                              borderRadius: "4px",
                              border: "1px solid rgba(30, 64, 175, 0.2)",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "600",
                                fontSize: "5px",
                                color: "#1e40af",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                marginBottom: "2px",
                              }}
                            >
                              Contact d'urgence
                            </div>
                            <div
                              style={{
                                fontSize: "4px",
                                color: "#374151",
                                wordBreak: "break-word",
                                lineHeight: "1.2",
                              }}
                            >
                              {student.emergencyContact || "Non renseigné"}
                            </div>
                          </div>

                          <div
                            style={{
                              background: "rgba(30, 64, 175, 0.1)",
                              padding: "4px 6px",
                              borderRadius: "4px",
                              border: "1px solid rgba(30, 64, 175, 0.2)",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "600",
                                fontSize: "5px",
                                color: "#1e40af",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                marginBottom: "2px",
                              }}
                            >
                              Adresse
                            </div>
                            <div
                              style={{
                                fontSize: "4px",
                                color: "#374151",
                                wordBreak: "break-word",
                                lineHeight: "1.2",
                              }}
                            >
                              {student.address || "Non renseigné"}
                            </div>
                          </div>

                          <div
                            style={{
                              background: "rgba(30, 64, 175, 0.1)",
                              padding: "4px 6px",
                              borderRadius: "4px",
                              border: "1px solid rgba(30, 64, 175, 0.2)",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "600",
                                fontSize: "5px",
                                color: "#1e40af",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                marginBottom: "2px",
                              }}
                            >
                              Statut matrimonial
                            </div>
                            <div
                              style={{
                                fontSize: "4px",
                                color: "#374151",
                                lineHeight: "1.2",
                              }}
                            >
                              {student.maritalStatus || "Non renseigné"}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <div
                            style={{
                              background: "rgba(30, 64, 175, 0.1)",
                              padding: "4px 6px",
                              borderRadius: "4px",
                              border: "1px solid rgba(30, 64, 175, 0.2)",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "600",
                                fontSize: "5px",
                                color: "#1e40af",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                marginBottom: "2px",
                              }}
                            >
                              Père
                            </div>
                            <div
                              style={{
                                fontSize: "4px",
                                color: "#374151",
                                lineHeight: "1.2",
                              }}
                            >
                              {student.fatherName || "Non renseigné"}
                            </div>
                          </div>

                          <div
                            style={{
                              background: "rgba(30, 64, 175, 0.1)",
                              padding: "4px 6px",
                              borderRadius: "4px",
                              border: "1px solid rgba(30, 64, 175, 0.2)",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "600",
                                fontSize: "5px",
                                color: "#1e40af",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                marginBottom: "2px",
                              }}
                            >
                              Mère
                            </div>
                            <div
                              style={{
                                fontSize: "4px",
                                color: "#374151",
                                lineHeight: "1.2",
                              }}
                            >
                              {student.motherName || "Non renseigné"}
                            </div>
                          </div>

                          <div
                            style={{
                              background: "rgba(30, 64, 175, 0.1)",
                              padding: "4px 6px",
                              borderRadius: "4px",
                              border: "1px solid rgba(30, 64, 175, 0.2)",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "600",
                                fontSize: "5px",
                                color: "#1e40af",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                marginBottom: "2px",
                              }}
                            >
                              Tuteur
                            </div>
                            <div
                              style={{
                                fontSize: "4px",
                                color: "#374151",
                                lineHeight: "1.2",
                              }}
                            >
                              {student.tutorName || "Non renseigné"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer verso */}
                      <div
                        style={{
                          fontSize: "5px",
                          textAlign: "center",
                          padding: "2px",
                          background: "rgba(30, 64, 175, 0.1)",
                          borderRadius: "2px",
                          fontWeight: "500",
                          lineHeight: "1.1",
                        }}
                      >
                        <div style={{ fontWeight: "bold" }}>
                          En cas de perte, scanner le QR code
                        </div>
                        <div>
                          Institut Technique 'l'Antidote' de Kati (ITAK)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-6 justify-center">
                <Button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  disabled={isGenerating}
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </Button>
                <Button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  disabled={isGenerating}
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </Button>
              </div>
            </div>

            {/* Informations et paramètres */}
          </div>
        </div>
      </motion.div>

      {/* Section d'impression cachée */}
      <div style={{ display: "none" }}>
        <div ref={printRef}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
              padding: "20px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {/* Recto pour impression */}
            <div
              style={{
                width: "85.6mm",
                height: "54mm",
                background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                color: "white",
                borderRadius: "8px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                border: "1px solid #ccc",
              }}
            >
              {/* Filigrane */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(-15deg)",
                  fontSize: "60px",
                  fontWeight: "900",
                  color: "rgba(255, 255, 255, 0.1)",
                  zIndex: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                UPCD ITAK
              </div>

              {/* Contenu recto */}
              <div style={{ position: "relative", zIndex: 2 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      background: "white",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2px",
                    }}
                  >
                    <img
                      src={logoItak}
                      alt="ITAK"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      textAlign: "right",
                      lineHeight: "1.2",
                    }}
                  >
                    <div>Carte Étudiant</div>
                    <div style={{ fontSize: "8px", opacity: 0.9 }}>
                      2024-2025
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1, marginRight: "12px" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginBottom: "6px",
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      {student?.user.firstName} {student?.user.lastName}
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        lineHeight: "1.4",
                        opacity: 0.95,
                      }}
                    >
                      <div
                        style={{
                          marginBottom: "4px",
                          background: "rgba(255, 255, 255, 0.15)",
                          padding: "3px 6px",
                          borderRadius: "3px",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "600",
                            fontSize: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                            opacity: 0.9,
                          }}
                        >
                          Matricule
                        </span>
                        <div style={{ fontSize: "8px", marginTop: "1px" }}>
                          {student?.matricule || "N/A"}
                        </div>
                      </div>
                      <div
                        style={{
                          marginBottom: "4px",
                          background: "rgba(255, 255, 255, 0.15)",
                          padding: "3px 6px",
                          borderRadius: "3px",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "600",
                            fontSize: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                            opacity: 0.9,
                          }}
                        >
                          Email
                        </span>
                        <div style={{ fontSize: "8px", marginTop: "1px" }}>
                          {student?.user.email}
                        </div>
                      </div>
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.15)",
                          padding: "3px 6px",
                          borderRadius: "3px",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "600",
                            fontSize: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                            opacity: 0.9,
                          }}
                        >
                          Inscription
                        </span>
                        <div style={{ fontSize: "8px", marginTop: "1px" }}>
                          {formatDate(student?.enrollmentDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {qrCodeDataUrl && (
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        background: "white",
                        borderRadius: "6px",
                        padding: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}
                    >
                      <img
                        src={qrCodeDataUrl}
                        alt="QR Code"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div
                  style={{
                    fontSize: "6px",
                    opacity: 0.9,
                    textAlign: "center",
                    marginTop: "4px",
                    fontWeight: "500",
                    letterSpacing: "0.2px",
                    lineHeight: "1.0",
                  }}
                >
                  Étudiant à Institut Technique 'l'Antidote' de Kati (ITAK)
                </div>
              </div>
            </div>

            {/* Verso pour impression */}
            <div
              style={{
                width: "85.6mm",
                height: "54mm",
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                color: "#1e40af",
                borderRadius: "8px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                border: "1px solid #ccc",
              }}
            >
              {/* Filigrane */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(-15deg)",
                  fontSize: "60px",
                  fontWeight: "900",
                  color: "rgba(30, 64, 175, 0.08)",
                  zIndex: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                UPCD ITAK
              </div>

              {/* Contenu verso */}
              <div style={{ position: "relative", zIndex: 2 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      color: "#1e40af",
                    }}
                  >
                    Informations détaillées
                  </div>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      background: "#1e40af",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2px",
                    }}
                  >
                    <img
                      src={logoItak}
                      alt="ITAK"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter: "brightness(0) invert(1)",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    fontSize: "6px",
                    lineHeight: "1.3",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(30, 64, 175, 0.1)",
                        padding: "4px 6px",
                        borderRadius: "4px",
                        border: "1px solid rgba(30, 64, 175, 0.2)",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "5px",
                          color: "#1e40af",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "2px",
                        }}
                      >
                        Contact d'urgence
                      </div>
                      <div
                        style={{
                          fontSize: "4px",
                          color: "#374151",
                          wordBreak: "break-word",
                          lineHeight: "1.2",
                        }}
                      >
                        {student?.emergencyContact || "Non renseigné"}
                      </div>
                    </div>
                    <div
                      style={{
                        background: "rgba(30, 64, 175, 0.1)",
                        padding: "4px 6px",
                        borderRadius: "4px",
                        border: "1px solid rgba(30, 64, 175, 0.2)",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "5px",
                          color: "#1e40af",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "2px",
                        }}
                      >
                        Adresse
                      </div>
                      <div
                        style={{
                          fontSize: "4px",
                          color: "#374151",
                          wordBreak: "break-word",
                          lineHeight: "1.2",
                        }}
                      >
                        {student?.address || "Non renseigné"}
                      </div>
                    </div>
                    <div
                      style={{
                        background: "rgba(30, 64, 175, 0.1)",
                        padding: "4px 6px",
                        borderRadius: "4px",
                        border: "1px solid rgba(30, 64, 175, 0.2)",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "5px",
                          color: "#1e40af",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "2px",
                        }}
                      >
                        Statut matrimonial
                      </div>
                      <div
                        style={{
                          fontSize: "4px",
                          color: "#374151",
                          lineHeight: "1.2",
                        }}
                      >
                        {student?.maritalStatus || "Non renseigné"}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(30, 64, 175, 0.1)",
                        padding: "4px 6px",
                        borderRadius: "4px",
                        border: "1px solid rgba(30, 64, 175, 0.2)",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "5px",
                          color: "#1e40af",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "2px",
                        }}
                      >
                        Père
                      </div>
                      <div
                        style={{
                          fontSize: "4px",
                          color: "#374151",
                          lineHeight: "1.2",
                        }}
                      >
                        {student?.fatherName || "Non renseigné"}
                      </div>
                    </div>
                    <div
                      style={{
                        background: "rgba(30, 64, 175, 0.1)",
                        padding: "4px 6px",
                        borderRadius: "4px",
                        border: "1px solid rgba(30, 64, 175, 0.2)",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "5px",
                          color: "#1e40af",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "2px",
                        }}
                      >
                        Mère
                      </div>
                      <div
                        style={{
                          fontSize: "4px",
                          color: "#374151",
                          lineHeight: "1.2",
                        }}
                      >
                        {student?.motherName || "Non renseigné"}
                      </div>
                    </div>
                    <div
                      style={{
                        background: "rgba(30, 64, 175, 0.1)",
                        padding: "4px 6px",
                        borderRadius: "4px",
                        border: "1px solid rgba(30, 64, 175, 0.2)",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "5px",
                          color: "#1e40af",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "2px",
                        }}
                      >
                        Tuteur
                      </div>
                      <div
                        style={{
                          fontSize: "4px",
                          color: "#374151",
                          lineHeight: "1.2",
                        }}
                      >
                        {student?.tutorName || "Non renseigné"}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "4px",
                    textAlign: "center",
                    padding: "1px",
                    background: "rgba(30, 64, 175, 0.1)",
                    borderRadius: "1px",
                    fontWeight: "500",
                    lineHeight: "1.0",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    En cas de perte, scanner le QR code
                  </div>
                  <div>Institut Technique 'l'Antidote' de Kati (ITAK)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCardGenerator;
