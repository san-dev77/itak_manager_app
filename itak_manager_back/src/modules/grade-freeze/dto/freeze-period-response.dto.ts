import {
  FreezeScope,
  FreezeStatus,
} from '../../../entities/grade-freeze-period.entity';

export class FreezePeriodResponseDto {
  id: string;
  schoolYearId: string;
  termId: string;
  classId: string;
  title: string;
  description: string;
  scope: FreezeScope;
  status: FreezeStatus;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  approvedBy: string;
  approvedAt: Date;
  cancelledBy: string;
  cancelledAt: Date;
  cancellationReason: string;
  allowEmergencyOverride: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Related data
  schoolYear?: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
  };

  term?: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
  };

  class?: {
    id: string;
    name: string;
    level: string;
  };

  creator?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  approver?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  canceller?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export class FreezeStatusCheckDto {
  isFrozen: boolean;
  freezePeriod?: FreezePeriodResponseDto;
  canOverride: boolean;
}

export class ApproveFreezePeriodDto {
  approvedBy: string;
}

export class CancelFreezePeriodDto {
  cancelledBy: string;
  reason: string;
}

export class VerifyOverrideDto {
  password: string;
}
