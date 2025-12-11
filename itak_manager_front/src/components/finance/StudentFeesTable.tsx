import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit3,
  Trash2,
  FileText,
  DollarSign,
  Wallet,
} from "lucide-react";
import Button from "../ui/Button";

interface StudentFee {
  id: string;
  studentId: string;
  feeTypeId: string;
  academicYearId: string;
  amountAssigned: number;
  dueDate: string;
  status: "pending" | "partial" | "paid" | "overdue";
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
  };
  feeType: {
    id: string;
    name: string;
    amountDefault: number;
  };
  academicYear: {
    id: string;
    name: string;
  };
  amountPaid: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string;
}

interface FullStudent {
  id: string;
  userId: string;
  matricule: string;
  photo?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// Utiliser le type StudentClass de l'API
type StudentClass = import("../../services/api").StudentClass;

interface Payment {
  id: string;
  studentFeeId: string;
  amount: number;
  status: string;
}

interface StudentFeesTableProps {
  studentFees: StudentFee[];
  users: User[];
  fullStudents?: FullStudent[];
  studentClasses: StudentClass[];
  payments: Payment[];
  onEdit: (fee: StudentFee) => void;
  onDelete: (id: string) => void;
  onPayment?: (studentId: string) => void;
}

interface GroupedStudentFee {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
  };
  fees: StudentFee[];
  totalAssigned: number;
  totalPaid: number;
  totalRemaining: number;
}

const StudentFeesTable: React.FC<StudentFeesTableProps> = ({
  studentFees,
  users,
  fullStudents = [],
  studentClasses,
  payments,
  onEdit,
  onDelete,
  onPayment,
}) => {
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(
    new Set()
  );

  // Fonction pour obtenir les données utilisateur d'un étudiant
  const getStudentUser = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  // Fonction pour obtenir l'étudiant complet avec photo
  const getFullStudent = (studentId: string) => {
    return fullStudents.find((student) => student.id === studentId);
  };

  // Fonction pour obtenir la classe d'un étudiant
  const getStudentClass = (studentId: string) => {
    let studentClass = studentClasses.find(
      (sc) => sc.studentId === studentId && !sc.endDate
    );

    if (!studentClass) {
      studentClass = studentClasses.find((sc) => sc.studentId === studentId);
    }

    if (!studentClass?.class) return "Non assigné";

    const className = studentClass.class.name;
    // Vérifier si classCategory existe et a une institution
    const classCategory = studentClass.class.classCategory;
    const institution = classCategory?.institution;

    // Debug: afficher les données pour comprendre
    if (studentId && !institution && classCategory) {
      console.log("🔍 Classe trouvée mais pas d'institution:", {
        studentId,
        className,
        classCategory,
        fullClass: studentClass.class,
      });
    }

    if (institution) {
      return `${className} (${institution.code || institution.name})`;
    }

    return className;
  };

  // Fonction pour calculer le montant payé réel
  const getActualAmountPaid = React.useCallback(
    (studentFeeId: string) => {
      const successfulPayments = payments.filter(
        (payment) =>
          payment.studentFeeId === studentFeeId &&
          payment.status === "successful"
      );

      return successfulPayments.reduce((sum, payment) => {
        return sum + (Number(payment.amount) || 0);
      }, 0);
    },
    [payments]
  );

  // Formater les montants
  const formatAmount = (amount: number | string | undefined | null): string => {
    if (amount === undefined || amount === null || amount === "") {
      return "0";
    }
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    return numericAmount.toLocaleString("fr-FR");
  };

  // Grouper les frais par étudiant
  const groupedStudentFees = useMemo(() => {
    const grouped = new Map<string, GroupedStudentFee>();

    studentFees.forEach((fee) => {
      if (!fee.student || !fee.student.id) return;

      const studentId = fee.student.id;
      if (!grouped.has(studentId)) {
        grouped.set(studentId, {
          student: fee.student,
          fees: [],
          totalAssigned: 0,
          totalPaid: 0,
          totalRemaining: 0,
        });
      }

      const group = grouped.get(studentId)!;
      group.fees.push(fee);
      group.totalAssigned += Number(fee.amountAssigned) || 0;

      const actualPaid = getActualAmountPaid(fee.id);
      group.totalPaid += actualPaid;
    });

    // Calculer le total restant pour chaque groupe
    Array.from(grouped.values()).forEach((group) => {
      group.totalRemaining = group.totalAssigned - group.totalPaid;
    });

    return Array.from(grouped.values());
  }, [studentFees, getActualAmountPaid]);

  const toggleStudentExpansion = (studentId: string) => {
    setExpandedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "partial":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Payé";
      case "partial":
        return "Partiel";
      case "pending":
        return "En attente";
      case "overdue":
        return "En retard";
      default:
        return status;
    }
  };

  if (groupedStudentFees.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-md border border-slate-200">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Aucun frais étudiant
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Commencez par attribuer des frais aux étudiants pour suivre leurs
            paiements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="text-left px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Étudiant
              </th>
              <th className="text-left px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Classe
              </th>
              <th className="text-center px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Total Assigné
              </th>
              <th className="text-center px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Total Payé
              </th>
              <th className="text-center px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Total Restant
              </th>
              <th className="text-center px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Nombre de frais
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {groupedStudentFees.map((group) => {
              const studentUser = getStudentUser(group.student.id);
              const fullStudent = getFullStudent(group.student.id);
              const isExpanded = expandedStudents.has(group.student.id);
              const studentClass = getStudentClass(group.student.id);

              // Utiliser la photo de l'étudiant complet si disponible, sinon celle de l'utilisateur
              const studentPhoto = fullStudent?.photo || studentUser?.photo;
              const studentFirstName =
                fullStudent?.user?.firstName ||
                studentUser?.firstName ||
                group.student.firstName;
              const studentLastName =
                fullStudent?.user?.lastName ||
                studentUser?.lastName ||
                group.student.lastName;

              return (
                <React.Fragment key={group.student.id}>
                  {/* Ligne principale */}
                  <tr
                    className={`transition-all duration-200 cursor-pointer ${
                      isExpanded
                        ? "bg-blue-50 border-l-4 border-l-blue-600 shadow-sm"
                        : "hover:bg-blue-50/70 hover:shadow-md hover:scale-[1] hover:border-l-4 hover:border-l-blue-400"
                    }`}
                    onClick={() => toggleStudentExpansion(group.student.id)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        {/* Photo de l'étudiant */}
                        <div
                          className={`w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                            isExpanded
                              ? "ring-2 ring-blue-500 ring-offset-2 scale-110"
                              : "hover:scale-110 hover:ring-2 hover:ring-blue-400"
                          }`}
                        >
                          {studentPhoto ? (
                            <img
                              src={studentPhoto}
                              alt={`${studentFirstName} ${studentLastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-sm">
                              {studentFirstName?.[0] || ""}
                              {studentLastName?.[0] || ""}
                            </span>
                          )}
                        </div>
                        <div>
                          <div
                            className={`font-semibold transition-colors duration-200 ${
                              isExpanded ? "text-blue-900" : "text-slate-900"
                            }`}
                          >
                            {studentFirstName && studentLastName
                              ? `${studentFirstName} ${studentLastName}`
                              : `Étudiant ${group.student.matricule}`}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            {group.student.matricule}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-200 ${
                          isExpanded
                            ? "bg-purple-200 text-purple-900 shadow-sm"
                            : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                        }`}
                      >
                        {studentClass}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <TrendingUp
                          className={`w-4 h-4 transition-colors duration-200 ${
                            isExpanded ? "text-blue-700" : "text-blue-600"
                          }`}
                        />
                        <span
                          className={`font-bold transition-colors duration-200 ${
                            isExpanded ? "text-blue-900" : "text-gray-900"
                          }`}
                        >
                          {formatAmount(group.totalAssigned)} FCFA
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <CreditCard
                          className={`w-4 h-4 transition-colors duration-200 ${
                            isExpanded ? "text-green-700" : "text-green-600"
                          }`}
                        />
                        <span
                          className={`font-bold transition-colors duration-200 ${
                            isExpanded ? "text-green-800" : "text-green-700"
                          }`}
                        >
                          {formatAmount(group.totalPaid)} FCFA
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div
                        className={`flex items-center justify-center space-x-1 transition-colors duration-200 ${
                          group.totalRemaining > 0
                            ? isExpanded
                              ? "text-red-800"
                              : "text-red-700"
                            : isExpanded
                            ? "text-green-800"
                            : "text-green-700"
                        }`}
                      >
                        {group.totalRemaining > 0 ? (
                          <TrendingDown
                            className={`w-4 h-4 transition-colors duration-200 ${
                              isExpanded ? "text-red-700" : "text-red-600"
                            }`}
                          />
                        ) : (
                          <CheckCircle
                            className={`w-4 h-4 transition-colors duration-200 ${
                              isExpanded ? "text-green-700" : "text-green-600"
                            }`}
                          />
                        )}
                        <span className="font-bold">
                          {formatAmount(group.totalRemaining)} FCFA
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <DollarSign
                          className={`w-4 h-4 transition-colors duration-200 ${
                            isExpanded ? "text-blue-700" : "text-blue-600"
                          }`}
                        />
                        <span
                          className={`font-bold transition-colors duration-200 ${
                            isExpanded ? "text-blue-900" : "text-blue-800"
                          }`}
                        >
                          {group.fees.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-center mt-1 space-x-2">
                        {onPayment && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPayment(group.student.id);
                            }}
                            className="p-1.5 rounded-full bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-900 transition-all duration-200 hover:scale-110 cursor-pointer"
                            title="Enregistrer un paiement"
                          >
                            <Wallet className="w-4 h-4" />
                          </button>
                        )}
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-blue-600 animate-pulse" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500 transition-transform duration-200 hover:translate-x-1" />
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Ligne expandable avec les détails des frais */}
                  {isExpanded && (
                    <tr className="bg-blue-50/30 border-l-4 border-l-blue-600">
                      <td
                        colSpan={6}
                        className="px-5 py-4 bg-gradient-to-r from-blue-50/50 to-slate-50"
                      >
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                            <div className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                              Détails des frais
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                          </div>
                          <div className="space-y-2">
                            {group.fees.map((fee) => {
                              const actualAmountPaid = getActualAmountPaid(
                                fee.id
                              );
                              const remainingAmount =
                                Number(fee.amountAssigned) - actualAmountPaid;

                              return (
                                <div
                                  key={fee.id}
                                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 hover:ring-2 hover:ring-blue-100"
                                >
                                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                                    {/* Type de frais */}
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                                        <FileText className="w-5 h-5 text-white" />
                                      </div>
                                      <div>
                                        <div className="text-sm font-bold text-gray-900">
                                          {fee.feeType.name}
                                        </div>
                                        <div className="text-xs text-gray-600 font-medium">
                                          {fee.academicYear.name}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Montant assigné */}
                                    <div className="text-center">
                                      <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                                        <div className="flex items-center justify-center space-x-1 mb-1">
                                          <TrendingUp className="w-3 h-3 text-blue-600" />
                                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                                            Assigné
                                          </span>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900">
                                          {formatAmount(fee.amountAssigned)}{" "}
                                          FCFA
                                        </div>
                                      </div>
                                    </div>

                                    {/* Montant payé */}
                                    <div className="text-center">
                                      <div
                                        className={`rounded-lg p-2 border ${
                                          actualAmountPaid > 0
                                            ? actualAmountPaid >=
                                              Number(fee.amountAssigned)
                                              ? "bg-green-50 border-green-200"
                                              : "bg-blue-50 border-blue-200"
                                            : "bg-gray-50 border-gray-200"
                                        }`}
                                      >
                                        <div className="flex items-center justify-center space-x-1 mb-1">
                                          <CreditCard
                                            className={`w-3 h-3 ${
                                              actualAmountPaid > 0
                                                ? actualAmountPaid >=
                                                  Number(fee.amountAssigned)
                                                  ? "text-green-600"
                                                  : "text-blue-600"
                                                : "text-gray-500"
                                            }`}
                                          />
                                          <span
                                            className={`text-xs font-semibold uppercase tracking-wide ${
                                              actualAmountPaid > 0
                                                ? actualAmountPaid >=
                                                  Number(fee.amountAssigned)
                                                  ? "text-green-600"
                                                  : "text-blue-600"
                                                : "text-gray-500"
                                            }`}
                                          >
                                            Payé
                                          </span>
                                        </div>
                                        <div
                                          className={`text-sm font-bold ${
                                            actualAmountPaid > 0
                                              ? actualAmountPaid >=
                                                Number(fee.amountAssigned)
                                                ? "text-green-700"
                                                : "text-blue-700"
                                              : "text-gray-600"
                                          }`}
                                        >
                                          {formatAmount(actualAmountPaid)} FCFA
                                          {actualAmountPaid > 0 &&
                                            actualAmountPaid <
                                              Number(fee.amountAssigned) && (
                                              <span className="text-xs text-blue-500 ml-1 font-medium">
                                                (partiel)
                                              </span>
                                            )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Montant restant */}
                                    <div className="text-center">
                                      <div
                                        className={`rounded-lg p-2 border ${
                                          remainingAmount > 0
                                            ? "bg-red-50 border-red-200"
                                            : "bg-green-50 border-green-200"
                                        }`}
                                      >
                                        <div className="flex items-center justify-center space-x-1 mb-1">
                                          {remainingAmount > 0 ? (
                                            <TrendingDown className="w-3 h-3 text-red-600" />
                                          ) : (
                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                          )}
                                          <span
                                            className={`text-xs font-semibold uppercase tracking-wide ${
                                              remainingAmount > 0
                                                ? "text-red-600"
                                                : "text-green-600"
                                            }`}
                                          >
                                            Restant
                                          </span>
                                        </div>
                                        <div
                                          className={`text-sm font-bold ${
                                            remainingAmount > 0
                                              ? "text-red-700"
                                              : "text-green-700"
                                          }`}
                                        >
                                          {formatAmount(remainingAmount)} FCFA
                                        </div>
                                      </div>
                                    </div>

                                    {/* Date d'échéance */}
                                    <div className="text-center">
                                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                        <div className="flex items-center justify-center space-x-1 mb-1">
                                          <Calendar className="w-3 h-3 text-gray-600" />
                                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            Échéance
                                          </span>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900">
                                          {fee.dueDate
                                            ? new Date(
                                                fee.dueDate
                                              ).toLocaleDateString("fr-FR")
                                            : "Non définie"}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Statut et Actions */}
                                    <div className="flex flex-col space-y-2">
                                      <div className="flex justify-center">
                                        <span
                                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                                            fee.status
                                          )}`}
                                        >
                                          {fee.status === "paid" && (
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                          )}
                                          {fee.status === "partial" && (
                                            <Clock className="w-3 h-3 mr-1" />
                                          )}
                                          {fee.status === "pending" && (
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                          )}
                                          {getStatusText(fee.status)}
                                        </span>
                                      </div>
                                      <div className="flex flex-col space-y-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={(e) => {
                                            e?.stopPropagation();
                                            onEdit(fee);
                                          }}
                                          className="text-xs"
                                        >
                                          <Edit3 className="w-3 h-3 mr-1" />
                                          Modifier
                                        </Button>
                                        <button
                                          onClick={(e) => {
                                            e?.stopPropagation();
                                            onDelete(fee.id);
                                          }}
                                          className="flex items-center justify-center space-x-1 text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg text-xs font-semibold border border-red-200 hover:border-red-300 transition-all duration-200 hover:shadow-md"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                          <span>Supprimer</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentFeesTable;
