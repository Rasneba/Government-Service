export interface User {
  id: number
  fullName: string
  email: string
  username: string
  phoneNumber?: string
  role: string
  organizationId?: number
  organizationName?: string
  departmentId?: number
  departmentName?: string
}

export interface LoginResponse {
  token: string
  expiresAt: string
  user: User
}

export interface Organization {
  id: number
  name: string
  description?: string
  code?: string
  isActive: boolean
}

export interface Department {
  id: number
  name: string
  code?: string
  description?: string
  organizationId: number
  organizationName?: string
  parentDepartmentId?: number
  parentDepartmentName?: string
  isActive: boolean
}

export interface Letter {
  id: number
  letterNumber: string
  subject: string
  body: string
  priority: 'Low' | 'Normal' | 'High' | 'Urgent'
  status: 'Draft' | 'Submitted' | 'Approved' | 'Sent' | 'Received' | 'Closed' | 'Rejected'
  senderId: number
  senderName: string
  receiverId?: number
  receiverName?: string
  senderDepartmentId?: number
  senderDepartment?: string
  receiverDepartmentId?: number
  receiverDepartment?: string
  citizenName?: string
  caseNumber?: string
  dueDate?: string
  createdAt: string
  sentAt?: string
  receivedAt?: string
  closedAt?: string
  rejectionReason?: string
  isIncoming: boolean
  createdById: number
  createdByName: string
  attachments: Attachment[]
  movements: Movement[]
  comments: Comment[]
}

export interface LetterListItem {
  id: number
  letterNumber: string
  subject: string
  priority: string
  status: string
  senderName: string
  receiverName?: string
  senderDepartment?: string
  receiverDepartment?: string
  isIncoming: boolean
  createdAt: string
  dueDate?: string
  isOverdue: boolean
}

export interface CreateLetter {
  subject: string
  body: string
  priority: string
  receiverId?: number
  receiverDepartmentId?: number
  citizenName?: string
  caseNumber?: string
  dueDate?: string
  isIncoming: boolean
}

export interface Attachment {
  id: number
  fileName: string
  contentType?: string
  fileSize: number
  uploadedAt: string
  uploadedByName: string
}

export interface Movement {
  id: number
  fromUserName: string
  toUserName?: string
  fromDepartment?: string
  toDepartment?: string
  action: string
  notes?: string
  createdAt: string
}

export interface Comment {
  id: number
  userId: number
  userName: string
  comment: string
  createdAt: string
}

export interface Notification {
  id: number
  title: string
  message?: string
  type: string
  referenceId?: number
  referenceType?: string
  isRead: boolean
  createdAt: string
}

export interface DashboardData {
  totalLetters: number
  incomingToday: number
  outgoingToday: number
  pendingLetters: number
  overdueLetters: number
  recentlyReceived: RecentLetter[]
  recentlySent: RecentLetter[]
  departmentStats: DepartmentStat[]
  recentActivities: Activity[]
}

export interface RecentLetter {
  id: number
  letterNumber: string
  subject: string
  senderName: string
  priority: string
  status: string
  createdAt: string
}

export interface DepartmentStat {
  departmentName: string
  totalLetters: number
  pendingLetters: number
  completedLetters: number
}

export interface Activity {
  action: string
  userName: string
  details?: string
  createdAt: string
}

export interface LetterSearch {
  letterNumber?: string
  subject?: string
  senderName?: string
  receiverName?: string
  citizenName?: string
  caseNumber?: string
  dateFrom?: string
  dateTo?: string
  status?: string
  priority?: string
  departmentId?: number
  isIncoming?: boolean
  page?: number
  pageSize?: number
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  errors?: string[]
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface LetterReport {
  letterNumber: string
  subject: string
  priority: string
  status: string
  senderName: string
  receiverName?: string
  department: string
  createdAt: string
  dueDate?: string
  isOverdue: boolean
}

export interface MonthlyReport {
  year: number
  month: number
  monthName: string
  incoming: number
  outgoing: number
  pending: number
  completed: number
}

export interface DepartmentPerformance {
  departmentName: string
  totalLetters: number
  completedLetters: number
  pendingLetters: number
  overdueLetters: number
  avgCompletionDays: number
  performancePercentage: number
}

export interface Citizen {
  id: number
  fullName: string
  email?: string
  phoneNumber: string
  nationalId?: string
  gender?: string
  address?: string
  isVerified: boolean
  activeApplications: number
  completedApplications: number
}

export interface CitizenLoginResponse {
  token: string
  expiresAt: string
  citizen: Citizen
}

export interface ServiceCategory {
  id: number
  name: string
  description?: string
  icon?: string
  displayOrder: number
  isActive: boolean
  serviceCount: number
}

export interface ServiceType {
  id: number
  name: string
  description?: string
  categoryId?: number
  categoryName?: string
  code: string
  estimatedDays?: number
  fee: number
  requiresPoliceVerification: boolean
  requiredDocuments?: string
  isActive: boolean
  applicationCount: number
  workflowSteps?: WorkflowStepConfig[]
}

export interface WorkflowStepConfig {
  id: number
  name: string
  description?: string
  stepOrder: number
  stepType: string
  assignedRole?: string
  assignedDepartmentId?: number
  isAutoStep: boolean
  slaHours?: number
}

export interface ApplicationListItem {
  id: number
  applicationNumber: string
  serviceName: string
  serviceCode: string
  citizenName: string
  status: string
  currentStep?: string
  assignedOfficer?: string
  priority: string
  createdAt: string
  dueDate?: string
  isOverdue: boolean
}

export interface ApplicationDetail {
  id: number
  applicationNumber: string
  serviceTypeId: number
  serviceName: string
  citizenId: number
  citizenName: string
  citizenPhone: string
  status: string
  currentStepName?: string
  currentStepOrder?: number
  subject: string
  description?: string
  priority: string
  feeAmount: number
  feePaid: boolean
  rejectionReason?: string
  createdAt: string
  submittedAt?: string
  dueDate?: string
  completedAt?: string
  stepHistory: StepHistoryItem[]
  documents: ApplicationDocument[]
  notes: ApplicationNote[]
  workflowSteps: WorkflowStepDisplay[]
}

export interface StepHistoryItem {
  id: number
  stepName: string
  status: string
  assignedTo?: string
  notes?: string
  startedAt?: string
  completedAt?: string
}

export interface ApplicationDocument {
  id: number
  documentType: string
  fileName: string
  fileSize: number
  isVerified: boolean
  version: number
  uploadedAt: string
}

export interface ApplicationNote {
  id: number
  authorName: string
  note: string
  isInternal: boolean
  createdAt: string
}

export interface WorkflowStepDisplay {
  id: number
  name: string
  description?: string
  stepOrder: number
  stepType: string
  assignedRole?: string
  isAutoStep: boolean
  slaHours?: number
  executionStatus: string
  startedAt?: string
  completedAt?: string
  assignedTo?: string
}

export interface CitizenNotificationDto {
  id: number
  title: string
  message?: string
  type: string
  applicationId?: number
  referenceType?: string
  referenceId?: number
  isRead: boolean
  createdAt: string
}

export interface AppointmentDto {
  id: number
  serviceName: string
  applicationId?: number
  applicationNumber?: string
  departmentName?: string
  appointmentDate: string
  timeSlot: string
  status: string
  notes?: string
  createdAt: string
}

export interface ComplaintDto {
  id: number
  subject: string
  description: string
  category: string
  priority: string
  status: string
  assignedTo?: string
  resolution?: string
  createdAt: string
  resolvedAt?: string
  comments: ComplaintCommentDto[]
}

export interface ComplaintCommentDto {
  id: number
  authorName: string
  comment: string
  isStaff: boolean
  createdAt: string
}

export interface FeedbackDto {
  id: number
  citizenId: number
  citizenName: string
  applicationId?: number
  applicationNumber?: string
  type: string
  rating: number
  subject?: string
  message?: string
  isPublic: boolean
  createdAt: string
}
