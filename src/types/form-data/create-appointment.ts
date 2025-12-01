export interface CreateAppointmentFormData {
    startTime : Date;
    endTime? : Date;
    hostId : string;
    visitorId : string;
    location?: string;
    
}