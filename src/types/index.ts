// CliniVision Core Type Definitions


export type RiskLevel =
  | "Critical"
  | "High"
  | "Medium"
  | "Low";


export type DiagnosticStatus =
  | "Critical"
  | "Detected"
  | "Normal"
  | "Processing"
  | "Pending"
  | "Draft"
  | "Approved"
  | "Exported";


export type Gender =
  | "Male"
  | "Female";


export type ScanModality =
  | "CT"
  | "MRI"
  | "X-Ray"
  | "Ultrasound"
  | "PET";


export interface MedicalRecord {

  id:string;

  date:string;

  type:string;

  description:string;

  doctor:string;

  status:DiagnosticStatus;

}



export interface Patient {

  id:string;

  name:string;

  mrn:string;

  age:number;

  gender:Gender;

  dob:string;

  avatar?:string;


  diagnosis:string;

  risk:RiskLevel;

  status:DiagnosticStatus;


  totalScans:number;

  lastVisit:string;


  bloodGroup?:string;


  vitals?:{

    heartRate:string;

    bloodPressure:string;

    weight:string;

    oxygen:string;

  };


  alerts:string[];


  timeline:MedicalRecord[];

}



export interface BoundingBox {

  id:string;

  label:string;

  x:number;

  y:number;

  width:number;

  height:number;

  confidence:number;

}



export interface HeatmapPoint {

  x:number;

  y:number;

  intensity:number;

}



export interface ScanAnalysis {


  id:string;

  scanId:string;


  patientId:string;

  patientName:string;


  modality:ScanModality;


  date:string;


  bodyPart:string;


  sliceCount:number;


  sliceThickness:string;


  dicomUrl:string;


  imageUrl:string;


  diagnosis:string;


  findings:string;


  status:DiagnosticStatus;


  confidence:number;


  risk:RiskLevel;


  aiHeatmap:HeatmapPoint[];


  boundingBoxes:BoundingBox[];


  measurements?:{

    ctr?:string;

    lungVolume?:string;

  };


}



export interface AIInsight {


  id:string;

  title:string;


  confidence:number;


  status:DiagnosticStatus;


  description:string;


  category:string;


}



export interface ClinicalReport {


  id:string;


  scanId:string;


  patientId:string;


  patientName:string;


  modality:ScanModality;


  examination:string;


  date:string;


  physician:string;


  model:string;


  confidence:number;


  status:
    | "Draft"
    | "Approved"
    | "Exported";


  clinicalHistory:string;


  findings:{

    brainParenchyma?:string;

    ventricles?:string;

    vasculature?:string;

    general?:string;

  };


  impression:string;


  doctorSignature:string;


}



export interface DiagnosticMetric {


  label:string;

  value:string;

  change?:string;

  icon?:string;

}



export interface DashboardMetrics {


  totalScans:number;


  anomaliesDetected:number;


  pendingReviews:number;


  completedReports:number;


  aiAccuracy:number;


  activeQueue:number;


}



export interface QueueItem {


  id:string;

  patientId:string;

  patientName:string;

  modality:ScanModality;

  condition:string;

  confidence:number;

  status:DiagnosticStatus;

  time:string;

}



export interface UserProfile {


  name:string;

  role:string;

  department:string;

  email:string;

  avatar:string;

}



export interface SystemSettings {


  hospitalName:string;


  radiologistName:string;


  pacsEndpoint:string;


  pacsPort:string;


  apiKey:string;


  aiConfidenceThreshold:number;


  heatmapThreshold:number;


  autoApproveLowRisk:boolean;


  enableHL7:boolean;


  darkMode:boolean;


  emailNotifications:boolean;


  dicomSync:boolean;

}