import {

  Patient,
  ScanAnalysis,
  ClinicalReport,
  DashboardMetrics,
  UserProfile,
  SystemSettings,
  QueueItem

} from "@/types";



// ===============================
// PATIENT DATABASE
// ===============================


export const mockPatients:Patient[] = [


{

id:"PAT-9102",

name:"Aamina Bibi",

mrn:"RAD-2024-9102",

age:54,

gender:"Female",

dob:"1970-03-11",

diagnosis:"Pneumonia",

risk:"Critical",

status:"Detected",

totalScans:4,

lastVisit:"12 Oct 2024",

avatar:"/avatars/aamina.png",

alerts:[
"High pneumonia probability",
"Immediate physician review required"
],


vitals:{

heartRate:"86 bpm",

bloodPressure:"132/86",

weight:"68 kg",

oxygen:"92%"

},


timeline:[

{

id:"REC-01",

date:"12 Oct 2024",

type:"Chest X-Ray",

description:"Right upper lobe consolidation detected",

doctor:"Dr. Sarah Chen",

status:"Detected"

}

]

},



{

id:"PAT-8892",

name:"Elias Vance",

mrn:"PT-8892",

age:45,

gender:"Male",

dob:"1978-12-04",

diagnosis:"Chest CT Nodules",

risk:"Critical",

status:"Critical",

totalScans:7,

lastVisit:"Today",

avatar:"/avatars/elias.png",

alerts:[
"Pulmonary nodule detected",
"Requires oncology review"
],

vitals:{

heartRate:"82 bpm",

bloodPressure:"128/84",

weight:"84.5 kg",

oxygen:"94%"

},

timeline:[

{

id:"REC-02",

date:"Today",

type:"Chest CT High Resolution",

description:"1.2cm irregular pulmonary nodule detected",

doctor:"Dr. Sarah Chen",

status:"Critical"

}

]

},



{

id:"PAT-9101",

name:"Muhammad Ali",

mrn:"RAD-2024-9101",

age:31,

gender:"Male",

dob:"1993-06-15",

diagnosis:"Bone Fracture",

risk:"Critical",

status:"Detected",

totalScans:2,

lastVisit:"11 Oct 2024",

alerts:["Fracture line detected"],

timeline:[]

},



{

id:"PAT-9100",

name:"Zainab Khan",

mrn:"RAD-2024-9100",

age:28,

gender:"Female",

dob:"1996-02-20",

diagnosis:"Tuberculosis",

risk:"Low",

status:"Normal",

totalScans:3,

lastVisit:"10 Oct 2024",

alerts:["Routine monitoring"],

timeline:[]

},



{

id:"PAT-9099",

name:"Tariq Mahmood",

mrn:"RAD-2024-9099",

age:62,

gender:"Male",

dob:"1962-08-19",

diagnosis:"Cardiomegaly",

risk:"Critical",

status:"Detected",

totalScans:5,

lastVisit:"10 Oct 2024",

alerts:["Heart enlargement detected"],

timeline:[]

},



{

id:"PAT-49281A",

name:"James R. Holden",

mrn:"#492-81A",

age:64,

gender:"Male",

dob:"1960-01-09",

diagnosis:"Acute Ischemia",

risk:"Critical",

status:"Critical",

totalScans:6,

lastVisit:"24 Oct 2023",

alerts:["Restricted diffusion detected"],

timeline:[]

}

];




// ===============================
// SCAN ANALYSIS DATABASE
// ===============================


export const mockScans:ScanAnalysis[]=[


{

id:"SCAN-9102",

scanId:"RAD-2024-9102",

patientId:"PAT-9102",

patientName:"Aamina Bibi",

modality:"X-Ray",

date:"12 Oct 2024",

bodyPart:"Chest",

sliceCount:1,

sliceThickness:"2mm",

dicomUrl:"/dicom/chest-9102",

imageUrl:"/images/chest-xray.png",

diagnosis:"Pneumonia Focus",

findings:
"Dense consolidation detected in right upper lobe",

status:"Detected",

confidence:94,

risk:"Critical",

aiHeatmap:[

{x:70,y:30,intensity:95}

],

boundingBoxes:[

{

id:"ROI-1",

label:"Pneumonia Focus",

x:65,

y:25,

width:20,

height:25,

confidence:94

}

],

measurements:{

ctr:"0.48",

lungVolume:"6.2L"

}

},



{

id:"SCAN-9101",

scanId:"RAD-2024-9101",

patientId:"PAT-9101",

patientName:"Muhammad Ali",

modality:"X-Ray",

date:"11 Oct 2024",

bodyPart:"Bone",

sliceCount:1,

sliceThickness:"1mm",

dicomUrl:"/dicom/fracture",

imageUrl:"/images/bone.png",

diagnosis:"Bone Fracture",

findings:"Distal radius fracture identified",

status:"Detected",

confidence:98,

risk:"Critical",

aiHeatmap:[],

boundingBoxes:[]

},



{

id:"SCAN-8892",

scanId:"PT-8892",

patientId:"PAT-8892",

patientName:"Elias Vance",

modality:"CT",

date:"24 Oct 2024",

bodyPart:"Chest",

sliceCount:120,

sliceThickness:"1.5mm",

dicomUrl:"/dicom/chest-ct",

imageUrl:"/images/ct.png",

diagnosis:"Pulmonary Nodules",

findings:"Irregular pulmonary opacity",

status:"Critical",

confidence:91,

risk:"Critical",

aiHeatmap:[],

boundingBoxes:[]

}

];




// ===============================
// CLINICAL REPORTS
// ===============================


export const mockReports:ClinicalReport[]=[


{

id:"REPORT-001",

scanId:"SCAN-49281A",

patientId:"PAT-49281A",

patientName:"James R. Holden",

modality:"MRI",

examination:"MRI Brain w/wo Contrast",

date:"24 Oct 2023",

physician:"Dr. Sarah Chen",

model:"NeuroScan v4.2",

confidence:98,

status:"Draft",


clinicalHistory:
"64-year-old male presenting with progressive right-sided weakness and expressive aphasia.",


findings:{

brainParenchyma:
"Restricted diffusion involving left MCA territory consistent with acute infarction.",

ventricles:
"No hydrocephalus identified.",

vasculature:
"Major intracranial vessels maintained."

},


impression:
"Acute ischemic changes detected.",

doctorSignature:
"Dr. Sarah Chen"

}

];



// ===============================
// DASHBOARD
// ===============================


export const mockDashboardMetrics:DashboardMetrics={

totalScans:142,

anomaliesDetected:18,

pendingReviews:45,

completedReports:79,

aiAccuracy:96.8,

activeQueue:3

};




// ===============================
// QUEUE
// ===============================


export const mockQueue:QueueItem[]=[

{

id:"Q1",

patientId:"ID-8924A",

patientName:"Patient ID-8924A",

modality:"X-Ray",

condition:"Susp. Pneumonia",

confidence:94,

status:"Detected",

time:"14 mins ago"

},

{

id:"Q2",

patientId:"ID-4412B",

patientName:"Patient ID-4412B",

modality:"MRI",

condition:"Minor Anomaly",

confidence:68,

status:"Pending",

time:"42 mins ago"

}

];




// ===============================
// USER
// ===============================


export const mockUserProfile:UserProfile={

name:"Dr. Sarah Chen",

role:"HEAD RADIOLOGIST",

department:"Radiology",

email:"sarah.chen@clinivision.com",

avatar:"/avatars/dr-sarah.png"

};




// ===============================
// SETTINGS
// ===============================


export const mockSettings:SystemSettings={

hospitalName:"CliniVision Medical Center",

radiologistName:"Dr. Sarah Chen",

pacsEndpoint:"https://pacs.clinivision.local",

pacsPort:"8042",

apiKey:"CLINIVISION-SECURE-KEY",

aiConfidenceThreshold:90,

heatmapThreshold:85,

autoApproveLowRisk:true,

enableHL7:true,

darkMode:true,

emailNotifications:true,

dicomSync:true

};