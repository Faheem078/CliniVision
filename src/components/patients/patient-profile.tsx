"use client";


import {

Flag,

HeartPulse,

Weight,

Droplets,

Activity

} from "lucide-react";



interface PatientProfileProps {


patient:{

name:string;

mrn:string;

dob:string;

age:number;

gender:string;

status:string;

vitals?:{

heartRate:string;

bloodPressure:string;

weight:string;

oxygen:string;

};

};


}



export default function PatientProfile({

patient

}:PatientProfileProps){


const vitals=[


{

title:"Heart Rate",

value:patient.vitals?.heartRate || "82 bpm",

icon:HeartPulse

},


{

title:"Blood Pressure",

value:patient.vitals?.bloodPressure || "128/84",

icon:Activity

},


{

title:"Weight",

value:patient.vitals?.weight || "84.5 kg",

icon:Weight

},


{

title:"Blood O2",

value:patient.vitals?.oxygen || "94%",

icon:Droplets

}


];




return (

<div

className="
space-y-6
"

>


<div

className="
rounded-2xl
border
border-white/10
bg-[#0F172A]
p-6
"

>


<div

className="
flex
items-center
justify-between
"

>


<div

className="
flex
items-center
gap-4
"

>


<div

className="
h-16
w-16
rounded-full
bg-cyan-400/10
border
border-cyan-400/30
flex
items-center
justify-center
text-2xl
font-bold
text-cyan-300
"

>

{patient.name.charAt(0)}

</div>



<div>


<h1

className="
text-2xl
font-bold
text-white
"

>

{patient.name}

</h1>


<p

className="
text-slate-400
"

>

MRN: {patient.mrn}

</p>


<p

className="
text-sm
text-slate-500
"

>

DOB: {patient.dob} • {patient.age} Yrs • {patient.gender}

</p>


</div>


</div>





<span

className="
inline-flex
items-center
gap-2
rounded-full
bg-rose-500/10
border
border-rose-500/30
px-4
py-2
text-[#FFB4AB]
text-sm
"

>

<Flag size={15}/>

FLAGGED

</span>



</div>


</div>




<div

className="
grid
grid-cols-2
xl:grid-cols-4
gap-4
"

>


{

vitals.map((item)=>

<div

key={item.title}

className="
rounded-xl
border
border-white/10
bg-[#131B2E]
p-5
"

>


<item.icon

size={22}

className="text-cyan-400"

/>


<p

className="
mt-3
text-xs
text-slate-400
"

>

{item.title}

</p>


<p

className="
mt-1
text-xl
font-semibold
text-white
"

>

{item.value}

</p>



</div>

)


}


</div>



</div>

)

}