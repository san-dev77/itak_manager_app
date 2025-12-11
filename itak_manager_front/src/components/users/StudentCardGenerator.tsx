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
  redirectUrl?: string;
}

const StudentCardGenerator: React.FC<StudentCardGeneratorProps> = ({
  isOpen,
  onClose,
  student,
  redirectUrl = "https://upcd-itak.edu",
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

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
      const studentData = {
        id: student.id,
        name: `${student.user.firstName} ${student.user.lastName}`,
        matricule: student.matricule || "",
        redirectUrl: redirectUrl,
      };

      const qrData = JSON.stringify(studentData);

      const qrCodeUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: "#1e40af",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      });

      setQrCodeDataUrl(qrCodeUrl);
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [student, redirectUrl]);

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
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Date invalide";
    }
  };

  const getCurrentYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    // Si on est avant septembre, on est sur l'année précédente
    if (month < 8) {
      return `${year - 1}-${year}`;
    }
    return `${year}-${year + 1}`;
  };

  const handleDownload = async () => {
    if (cardRef.current && student) {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Impossible de créer le contexte canvas");
        }

        const cardWidth = 1016;
        const cardHeight = 640;
        canvas.width = cardWidth;
        canvas.height = cardHeight;

        // Fond bleu dégradé
        const gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
        gradient.addColorStop(0, "#1e3a5f");
        gradient.addColorStop(1, "#2563eb");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, cardWidth, cardHeight);

        // Photo de l'étudiant
        const photoSize = 140;
        const photoX = 40;
        const photoY = 180;

        ctx.fillStyle = "white";
        ctx.fillRect(photoX - 4, photoY - 4, photoSize + 8, photoSize + 8);

        if (student.photo) {
          const photoImg = new Image();
          photoImg.crossOrigin = "anonymous";
          photoImg.src = student.photo;
          await new Promise((resolve) => {
            photoImg.onload = resolve;
            photoImg.onerror = resolve;
          });
          ctx.drawImage(photoImg, photoX, photoY, photoSize, photoSize);
        } else {
          ctx.fillStyle = "#3b82f6";
          ctx.fillRect(photoX, photoY, photoSize, photoSize);
          ctx.fillStyle = "white";
          ctx.font = "bold 48px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            `${student.user.firstName?.[0] || ""}${
              student.user.lastName?.[0] || ""
            }`,
            photoX + photoSize / 2,
            photoY + photoSize / 2
          );
        }

        // Logo et titre
        ctx.fillStyle = "white";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "left";
        ctx.fillText("UPCD - ITAK", 40, 50);
        ctx.font = "14px Arial";
        ctx.fillText("Carte Étudiant", 40, 75);

        // Année
        ctx.textAlign = "right";
        ctx.font = "bold 18px Arial";
        ctx.fillText(getCurrentYear(), cardWidth - 40, 50);

        // Nom de l'étudiant
        ctx.textAlign = "left";
        ctx.font = "bold 28px Arial";
        ctx.fillText(
          `${student.user.firstName} ${student.user.lastName}`,
          200,
          210
        );

        // Infos
        ctx.font = "16px Arial";
        ctx.fillText(`Matricule: ${student.matricule || "N/A"}`, 200, 250);
        ctx.fillText(
          `Email: ${student.user.email || "Non renseigné"}`,
          200,
          280
        );
        ctx.fillText(
          `Inscription: ${formatDate(student.enrollmentDate)}`,
          200,
          310
        );

        // QR Code
        if (qrCodeDataUrl) {
          const qrSize = 100;
          const qrX = cardWidth - qrSize - 40;
          const qrY = cardHeight - qrSize - 80;

          ctx.fillStyle = "white";
          ctx.fillRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8);

          const qrImg = new Image();
          qrImg.onload = () => {
            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

            // Footer
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(
              "Institut Technique l'Antidote de Kati",
              cardWidth / 2,
              cardHeight - 20
            );

            const link = document.createElement("a");
            link.download = `carte-etudiant-${student.user.firstName}-${student.user.lastName}.png`;
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();
          };
          qrImg.src = qrCodeDataUrl;
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.fillText(
            "Institut Technique l'Antidote de Kati",
            cardWidth / 2,
            cardHeight - 20
          );

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        {/* Header compact */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <QrCode className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Carte Étudiante</h2>
              <p className="text-slate-400 text-xs">
                {student.user.firstName} {student.user.lastName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-50">
          {/* Toggle Recto/Verso */}
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => setShowBack(false)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !showBack
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <RotateCw className="w-4 h-4" />
              Recto
            </button>
            <button
              onClick={() => setShowBack(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showBack
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              Verso
            </button>
          </div>

          {/* Carte */}
          <div className="flex justify-center">
            <div
              ref={cardRef}
              className="relative"
              style={{
                width: "340px",
                height: "214px",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                transformStyle: "preserve-3d",
                transition: "transform 0.6s",
                transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Recto */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
                  color: "white",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Filigrane */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(-15deg)",
                    fontSize: "50px",
                    fontWeight: "900",
                    color: "rgba(255, 255, 255, 0.05)",
                    whiteSpace: "nowrap",
                  }}
                >
                  UPCD ITAK
                </div>

                <div className="p-4 h-full flex flex-col justify-between relative z-10">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <img
                        src={logoItak}
                        alt="ITAK"
                        className="w-8 h-8 rounded bg-white p-0.5 object-contain"
                      />
                      <div>
                        <div className="text-xs font-bold">UPCD - ITAK</div>
                        <div className="text-[10px] opacity-75">
                          Carte Étudiant
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded">
                        {getCurrentYear()}
                      </div>
                    </div>
                  </div>

                  {/* Content avec photo */}
                  <div className="flex gap-3 items-center">
                    {/* Photo */}
                    <div className="w-16 h-20 rounded overflow-hidden bg-white shadow-md flex-shrink-0">
                      {student.photo ? (
                        <img
                          src={student.photo}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                          {student.user.firstName?.[0]}
                          {student.user.lastName?.[0]}
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate mb-1">
                        {student.user.firstName} {student.user.lastName}
                      </div>
                      <div className="space-y-0.5 text-[9px] opacity-90">
                        <div className="bg-white/10 px-2 py-0.5 rounded">
                          <span className="opacity-70">Matricule:</span>{" "}
                          <span className="font-semibold">
                            {student.matricule || "N/A"}
                          </span>
                        </div>
                        <div className="bg-white/10 px-2 py-0.5 rounded truncate">
                          <span className="opacity-70">Email:</span>{" "}
                          <span className="font-semibold">
                            {student.user.email || "-"}
                          </span>
                        </div>
                        <div className="bg-white/10 px-2 py-0.5 rounded">
                          <span className="opacity-70">Inscrit:</span>{" "}
                          <span className="font-semibold">
                            {formatDate(student.enrollmentDate)}
                          </span>
                        </div>
                        {student.institution && (
                          <div className="bg-white/10 px-2 py-0.5 rounded">
                            <span className="opacity-70">Affectation:</span>{" "}
                            <span className="font-semibold">
                              {student.institution.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* QR Code */}
                    {qrCodeDataUrl && (
                      <div className="w-14 h-14 bg-white rounded p-1 shadow-md flex-shrink-0">
                        <img
                          src={qrCodeDataUrl}
                          alt="QR"
                          className="w-full h-full"
                        />
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="text-[8px] text-center opacity-70">
                    Institut Technique l'Antidote de Kati
                  </div>
                </div>
              </div>

              {/* Verso */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  color: "#1e3a5f",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {/* Filigrane verso */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(-15deg)",
                    fontSize: "50px",
                    fontWeight: "900",
                    color: "rgba(30, 58, 95, 0.05)",
                    whiteSpace: "nowrap",
                  }}
                >
                  UPCD ITAK
                </div>

                <div className="p-4 h-full flex flex-col justify-between relative z-10">
                  {/* Header verso */}
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold">Informations</div>
                    <img
                      src={logoItak}
                      alt="ITAK"
                      className="w-6 h-6 rounded object-contain"
                    />
                  </div>

                  {/* Infos en grille */}
                  <div className="grid grid-cols-2 gap-2 text-[8px]">
                    <InfoBlock
                      label="Contact d'urgence"
                      value={student.emergencyContact}
                    />
                    <InfoBlock label="Adresse" value={student.address} />
                    <InfoBlock label="Père" value={student.fatherName} />
                    <InfoBlock label="Mère" value={student.motherName} />
                    <InfoBlock label="Tuteur" value={student.tutorName} />
                    <InfoBlock label="Tél. tuteur" value={student.tutorPhone} />
                  </div>

                  {/* Footer verso */}
                  <div className="text-[7px] text-center bg-blue-50 rounded py-1 px-2">
                    <div className="font-bold text-blue-800">
                      En cas de perte, scanner le QR code
                    </div>
                    <div className="text-blue-600">
                      UPCD - ITAK | Kati, Mali
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 justify-center">
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium"
              disabled={isGenerating}
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </Button>
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              disabled={isGenerating}
            >
              <Download className="w-4 h-4" />
              Télécharger
            </Button>
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
            }}
          >
            {/* Recto impression */}
            <div
              style={{
                width: "85.6mm",
                height: "54mm",
                background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <img
                    src={logoItak}
                    alt="ITAK"
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "4px",
                      background: "white",
                      padding: "2px",
                    }}
                  />
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: "bold" }}>
                      UPCD - ITAK
                    </div>
                    <div style={{ fontSize: "8px", opacity: 0.8 }}>
                      Carte Étudiant
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    background: "rgba(255,255,255,0.2)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {getCurrentYear()}
                </div>
              </div>

              <div
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "65px",
                    background: "white",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  {student?.photo ? (
                    <img
                      src={student.photo}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "#3b82f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {student?.user.firstName?.[0]}
                      {student?.user.lastName?.[0]}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "4px",
                    }}
                  >
                    {student?.user.firstName} {student?.user.lastName}
                  </div>
                  <div style={{ fontSize: "8px", lineHeight: "1.4" }}>
                    <div>Matricule: {student?.matricule || "N/A"}</div>
                    <div>Email: {student?.user.email || "-"}</div>
                    <div>Inscrit: {formatDate(student?.enrollmentDate)}</div>
                    {student?.institution && (
                      <div>Affectation: {student.institution.name}</div>
                    )}
                  </div>
                </div>
                {qrCodeDataUrl && (
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "white",
                      borderRadius: "4px",
                      padding: "2px",
                    }}
                  >
                    <img
                      src={qrCodeDataUrl}
                      alt="QR"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                )}
              </div>

              <div
                style={{ fontSize: "6px", textAlign: "center", opacity: 0.8 }}
              >
                Institut Technique l'Antidote de Kati
              </div>
            </div>

            {/* Verso impression */}
            <div
              style={{
                width: "85.6mm",
                height: "54mm",
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                color: "#1e3a5f",
                borderRadius: "8px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                border: "1px solid #ccc",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "10px", fontWeight: "bold" }}>
                  Informations détaillées
                </div>
                <img
                  src={logoItak}
                  alt="ITAK"
                  style={{ width: "20px", height: "20px", borderRadius: "4px" }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  fontSize: "7px",
                }}
              >
                <PrintInfoBlock
                  label="Contact d'urgence"
                  value={student?.emergencyContact}
                />
                <PrintInfoBlock label="Adresse" value={student?.address} />
                <PrintInfoBlock label="Père" value={student?.fatherName} />
                <PrintInfoBlock label="Mère" value={student?.motherName} />
                <PrintInfoBlock label="Tuteur" value={student?.tutorName} />
                <PrintInfoBlock
                  label="Tél. tuteur"
                  value={student?.tutorPhone}
                />
              </div>

              <div
                style={{
                  fontSize: "6px",
                  textAlign: "center",
                  background: "rgba(30, 64, 175, 0.1)",
                  borderRadius: "4px",
                  padding: "4px",
                }}
              >
                <div style={{ fontWeight: "bold" }}>
                  En cas de perte, scanner le QR code
                </div>
                <div>UPCD - ITAK | Kati, Mali</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mini composant pour bloc d'info sur la carte
const InfoBlock = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div className="bg-blue-900/10 rounded px-2 py-1">
    <div className="text-[7px] uppercase opacity-60 font-medium">{label}</div>
    <div className="truncate font-medium">{value || "Non renseigné"}</div>
  </div>
);

// Mini composant pour impression
const PrintInfoBlock = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div
    style={{
      background: "rgba(30, 64, 175, 0.1)",
      borderRadius: "4px",
      padding: "4px",
    }}
  >
    <div
      style={{
        fontSize: "6px",
        textTransform: "uppercase",
        opacity: 0.6,
        fontWeight: "600",
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: "7px", fontWeight: "500" }}>
      {value || "Non renseigné"}
    </div>
  </div>
);

export default StudentCardGenerator;
