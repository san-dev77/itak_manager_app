import {
  Calendar,
  ChevronDown,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileText,
  GraduationCap,
  Receipt,
  TrendingUp,
  User,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import Button from "../ui/Button";

interface Payment {
  id: string;
  studentFeeId: string;
  paymentDate: string;
  amount: number;
  method: "cash" | "bank_transfer" | "mobile_money" | "card";
  provider?: string;
  transactionRef?: string;
  receivedBy: string;
  status: "successful" | "failed" | "pending";
  createdAt: string;
  studentFee?: {
    id: string;
    studentId: string;
    feeTypeId: string;
    academicYearId: string;
    amountAssigned: string | number;
    amountPaid: string | number;
    dueDate: string;
    status: string;
    academicYear?: {
      id: string;
      name: string;
    };
  };
  receivedByUser?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
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

interface FeeType {
  id: string;
  name: string;
}

interface PaymentsTableProps {
  payments: Payment[];
  fullStudents?: FullStudent[];
  studentClasses: StudentClass[];
  feeTypes: FeeType[];
  onViewInvoice?: (payment: Payment) => void;
  onEditPayment?: (payment: Payment) => void;
  onDeletePayment?: (payment: Payment) => void;
}

interface GroupedPayment {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
  };
  payments: Payment[];
  totalAmount: number;
  successfulCount: number;
  failedCount: number;
  pendingCount: number;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({
  payments,
  fullStudents = [],
  studentClasses,
  feeTypes,
  onViewInvoice,
  onEditPayment,
  onDeletePayment,
}) => {
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(
    new Set(),
  );

  const toggleStudentExpansion = (studentId: string) => {
    const newExpanded = new Set(expandedStudents);
    if (newExpanded.has(studentId)) {
      newExpanded.delete(studentId);
    } else {
      newExpanded.add(studentId);
    }
    setExpandedStudents(newExpanded);
  };

  const getFullStudent = (studentId: string): FullStudent | undefined => {
    return fullStudents.find((s) => s.id === studentId);
  };

  const getStudentClass = (studentId: string): string => {
    const studentClass = studentClasses.find(
      (sc) => sc.studentId === studentId && !sc.endDate,
    );
    if (!studentClass?.class) return "Non assigné";

    const className = studentClass.class.name;
    const institution = studentClass.class.classCategory?.institution;

    if (institution) {
      return `${className} (${institution.code})`;
    }

    return className;
  };

  const getFeeTypeName = (feeTypeId: string): string => {
    const feeType = feeTypes.find((ft) => ft.id === feeTypeId);
    return feeType ? feeType.name : "Type inconnu";
  };

  const getAcademicYearName = (payment: Payment): string => {
    if (payment.studentFee?.academicYear?.name) {
      return payment.studentFee.academicYear.name;
    }
    return "N/A";
  };

  const formatAmount = (amount: number | string | undefined | null): string => {
    if (amount === undefined || amount === null || amount === "") {
      return "0";
    }
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    return numericAmount.toLocaleString("fr-FR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "successful":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "successful":
        return "Réussi";
      case "failed":
        return "Échoué";
      case "pending":
        return "En attente";
      default:
        return status;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case "cash":
        return "Espèces";
      case "bank_transfer":
        return "Virement bancaire";
      case "mobile_money":
        return "Mobile Money";
      case "card":
        return "Carte bancaire";
      default:
        return method;
    }
  };

  const groupedPayments = useMemo(() => {
    const grouped = new Map<string, GroupedPayment>();

    payments.forEach((payment) => {
      if (!payment.studentFee) return;

      const studentId = payment.studentFee.studentId;
      const fullStudent = getFullStudent(studentId);

      if (!grouped.has(studentId)) {
        grouped.set(studentId, {
          student: {
            id: studentId,
            firstName: fullStudent?.user?.firstName || "Inconnu",
            lastName: fullStudent?.user?.lastName || "",
            matricule: fullStudent?.matricule || "N/A",
          },
          payments: [],
          totalAmount: 0,
          successfulCount: 0,
          failedCount: 0,
          pendingCount: 0,
        });
      }

      const group = grouped.get(studentId)!;
      group.payments.push(payment);
      group.totalAmount += Number(payment.amount) || 0;

      if (payment.status === "successful") {
        group.successfulCount += 1;
      } else if (payment.status === "failed") {
        group.failedCount += 1;
      } else if (payment.status === "pending") {
        group.pendingCount += 1;
      }
    });

    return Array.from(grouped.values());
  }, [payments, fullStudents]);

  if (groupedPayments.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-md border border-slate-200">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Receipt className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Aucun paiement trouvé
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Aucun paiement n'a été enregistré pour le moment.
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
                Total Payé
              </th>
              <th className="text-center px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Nombre de paiements
              </th>
              <th className="text-center px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {groupedPayments.map((group) => {
              const fullStudent = getFullStudent(group.student.id);
              const isExpanded = expandedStudents.has(group.student.id);
              const studentClass = getStudentClass(group.student.id);

              const studentPhoto = fullStudent?.photo;
              const studentFirstName =
                fullStudent?.user?.firstName || group.student.firstName;
              const studentLastName =
                fullStudent?.user?.lastName || group.student.lastName;

              return (
                <React.Fragment key={group.student.id}>
                  {/* Ligne principale */}
                  <tr
                    className={`transition-all duration-200 cursor-pointer ${
                      isExpanded
                        ? "bg-green-50 border-l-4 border-l-green-600 shadow-sm"
                        : "hover:bg-green-50/70 hover:shadow-md hover:scale-[1] hover:border-l-4 hover:border-l-green-400"
                    }`}
                    onClick={() => toggleStudentExpansion(group.student.id)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        {studentPhoto ? (
                          <img
                            src={studentPhoto}
                            alt={`${studentFirstName} ${studentLastName}`}
                            className="w-10 h-10 rounded-full object-cover border-2 border-green-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm border-2 border-green-200">
                            {studentFirstName.charAt(0).toUpperCase()}
                            {studentLastName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div
                            className={`font-semibold transition-colors duration-200 ${
                              isExpanded ? "text-green-900" : "text-gray-900"
                            }`}
                          >
                            {studentFirstName} {studentLastName}
                          </div>
                          <div className="text-sm text-gray-600">
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
                            isExpanded ? "text-green-700" : "text-green-600"
                          }`}
                        />
                        <span
                          className={`font-bold transition-colors duration-200 ${
                            isExpanded ? "text-green-900" : "text-gray-900"
                          }`}
                        >
                          {formatAmount(group.totalAmount)} FCFA
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Receipt
                          className={`w-4 h-4 transition-colors duration-200 ${
                            isExpanded ? "text-green-700" : "text-green-600"
                          }`}
                        />
                        <span
                          className={`font-bold transition-colors duration-200 ${
                            isExpanded ? "text-green-900" : "text-green-800"
                          }`}
                        >
                          {group.payments.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-center mt-1">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-green-600 animate-pulse" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500 transition-transform duration-200 hover:translate-x-1" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {group.successfulCount > 0 && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            {group.successfulCount} ✓
                          </span>
                        )}
                        {group.failedCount > 0 && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            {group.failedCount} ✗
                          </span>
                        )}
                        {group.pendingCount > 0 && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                            {group.pendingCount} ⏳
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Détails des paiements (expandable) */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={5} className="px-0 py-0">
                        <div className="bg-gradient-to-br from-green-50 to-green-100/50 border-t-2 border-green-200 animate-fade-in-slide-in">
                          <div className="p-6">
                            <h4 className="text-lg font-bold text-green-900 mb-4 flex items-center space-x-2">
                              <FileText className="w-5 h-5" />
                              <span>Détails des paiements</span>
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-green-100 border-b-2 border-green-200">
                                    <th className="text-left px-4 py-3 text-xs font-bold text-green-900 uppercase tracking-wider">
                                      Type de frais
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs font-bold text-green-900 uppercase tracking-wider">
                                      Année académique
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs font-bold text-green-900 uppercase tracking-wider">
                                      Montant
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs font-bold text-green-900 uppercase tracking-wider">
                                      Méthode
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs font-bold text-green-900 uppercase tracking-wider">
                                      Date
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs font-bold text-green-900 uppercase tracking-wider">
                                      Reçu par
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs font-bold text-green-900 uppercase tracking-wider">
                                      Statut
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs font-bold text-green-900 uppercase tracking-wider">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-green-100">
                                  {group.payments.map((payment) => (
                                    <tr
                                      key={payment.id}
                                      className="bg-white hover:bg-green-50/50 transition-colors"
                                    >
                                      <td className="px-4 py-3">
                                        <div>
                                          <span className="text-sm font-semibold text-gray-900">
                                            {getFeeTypeName(
                                              payment.studentFee?.feeTypeId ||
                                                "",
                                            )}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center space-x-1">
                                          <GraduationCap className="w-4 h-4 text-purple-600" />
                                          <span className="text-sm font-semibold text-purple-700">
                                            {getAcademicYearName(payment)}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center space-x-1">
                                          <DollarSign className="w-4 h-4 text-green-600" />
                                          <span className="text-sm font-bold text-gray-900">
                                            {formatAmount(payment.amount)} FCFA
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center space-x-1">
                                          <CreditCard className="w-4 h-4 text-blue-600" />
                                          <span className="text-sm text-gray-700">
                                            {getMethodText(payment.method)}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center space-x-1">
                                          <Calendar className="w-4 h-4 text-gray-600" />
                                          <span className="text-sm text-gray-700">
                                            {new Date(
                                              payment.paymentDate,
                                            ).toLocaleDateString("fr-FR")}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        {payment.receivedByUser ? (
                                          <div className="flex items-center justify-center space-x-1">
                                            <User className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm text-gray-700">
                                              {payment.receivedByUser.firstName}{" "}
                                              {payment.receivedByUser.lastName}
                                            </span>
                                          </div>
                                        ) : (
                                          <span className="text-sm text-gray-400">
                                            N/A
                                          </span>
                                        )}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <span
                                          className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                                            payment.status,
                                          )}`}
                                        >
                                          {getStatusText(payment.status)}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                          {onViewInvoice && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={(e) => {
                                                e?.stopPropagation();
                                                onViewInvoice(payment);
                                              }}
                                            >
                                              Facture
                                            </Button>
                                          )}
                                          {onEditPayment && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={(e) => {
                                                e?.stopPropagation();
                                                onEditPayment(payment);
                                              }}
                                            >
                                              Modifier
                                            </Button>
                                          )}
                                          {onDeletePayment && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="text-red-600 border-red-200 hover:bg-red-50"
                                              onClick={(e) => {
                                                e?.stopPropagation();
                                                onDeletePayment(payment);
                                              }}
                                            >
                                              Supprimer
                                            </Button>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
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

export default PaymentsTable;
