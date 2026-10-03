"use client";

import {
  useState
} from "react";

import {
  Search,
  UserRound
} from "lucide-react";


interface PatientItem {

  id:string;

  name:string;

  mrn:string;

  age:number;

  gender:string;

  status:string;

}



interface Props {

  patients:PatientItem[];

  selected:string;

  onSelect:(id:string)=>void;

}



export default function PatientList({

patients,

selected,

onSelect

}:Props){


const [search,setSearch]=useState("");



const filteredPatients =
patients.filter((patient)=>

patient.name
.toLowerCase()
.includes(search.toLowerCase())

||

patient.mrn
.toLowerCase()
.includes(search.toLowerCase())

);



return (

<div

className="
rounded-2xl
border
border-white/10
bg-[#0F172A]
p-5
h-full
"

>


<h2

className="
text-xl
font-semibold
text-white
mb-5
"

>

Patients

</h2>



<div

className="
relative
mb-5
"

>


<Search

size={17}

className="
absolute
left-3
top-1/2
-translate-y-1/2
text-slate-400
"

/>



<input

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

placeholder="Search patients..."

className="
w-full
rounded-xl
bg-[#0B0F17]
border
border-white/10
py-3
pl-10
text-sm
text-white
outline-none
focus:border-cyan-400
"

/>


</div>




<div

className="
space-y-3
"

>


{

filteredPatients.map((patient)=>(


<button

key={patient.id}

onClick={()=>onSelect(patient.id)}

className={`

w-full

text-left

rounded-xl

p-4

border

transition

${
selected===patient.id

?

"bg-cyan-500/10 border-cyan-400"

:

"bg-white/5 border-white/10 hover:bg-white/10"

}

`}

>


<div

className="
flex
items-center
gap-3
"

>


<div

className="
h-10
w-10
rounded-full
bg-cyan-400/10
flex
items-center
justify-center
"

>

<UserRound

size={20}

className="text-cyan-300"

/>

</div>




<div>

<p className="text-white font-medium">

{patient.name}

</p>


<p className="text-xs text-slate-400">

{patient.mrn}

</p>


</div>


</div>




<div

className="
mt-3
flex
justify-between
items-center
"

>


<span

className="
text-xs
text-slate-400
"

>

{patient.age} yrs • {patient.gender}

</span>



<span

className={`

rounded-full
px-3
py-1
text-xs
border

${
patient.status==="Critical"

?

"bg-rose-500/10 text-[#FFB4AB] border-rose-500/30"

:

patient.status==="Normal"

?

"bg-emerald-500/10 text-[#4DE082] border-emerald-500/30"

:

"bg-slate-800 text-slate-400 border-slate-700"

}

`}

>

{patient.status}

</span>


</div>



</button>


))


}


</div>



</div>

)

}