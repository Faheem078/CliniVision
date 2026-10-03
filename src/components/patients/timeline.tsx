"use client";


import {

useState,
KeyboardEvent

} from "react";


import {

Clock3,
FileImage,
Save,
BrainCircuit

} from "lucide-react";



interface TimelineProps {


records:{

id:string;

date:string;

type:string;

description:string;

doctor:string;

}[];


}



export default function Timeline({

records

}:TimelineProps){


const [note,setNote]=useState("");

const [message,setMessage]=useState("");



function saveNote(){

if(!note.trim()) return;


setMessage("Clinical note saved successfully");

setNote("");


setTimeout(()=>{

setMessage("");

},3000);


}



function handleKeyDown(

event:KeyboardEvent<HTMLTextAreaElement>

){

if(
event.key==="Enter" &&
!event.shiftKey
){

event.preventDefault();

saveNote();

}

}



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


<h2

className="
text-xl
font-semibold
text-white
flex
items-center
gap-2
"

>

<Clock3

size={20}

className="text-cyan-400"

/>

Scan History Timeline

</h2>




<div

className="
mt-6
space-y-5
"

>


{

records.length===0

?

<div

className="
text-slate-400
text-sm
"

>
No previous scans available.
</div>


:


records.map((record)=>(


<div

key={record.id}

className="
relative
border-l
border-cyan-400/30
pl-6
"

>


<div

className="
absolute
-left-[9px]
top-1
h-4
w-4
rounded-full
bg-cyan-400
"

></div>




<div

className="
rounded-xl
bg-white/5
border
border-white/10
p-4
"

>


<div

className="
flex
justify-between
gap-4
"

>

<div>


<p

className="
text-white
font-medium
"

>

{record.type}

</p>


<p

className="
text-xs
text-cyan-300
"

>

{record.date}

</p>


</div>



<FileImage

size={20}

className="text-slate-400"

/>


</div>




<p

className="
mt-3
text-sm
text-slate-300
"

>

{record.description}

</p>



<p

className="
mt-3
text-xs
text-slate-500
"

>

Reviewed by {record.doctor}

</p>



<button

className="
mt-4
rounded-lg
bg-cyan-400
px-4
py-2
text-sm
font-medium
text-black
"

>

View Scan Images

</button>



</div>


</div>


))


}


</div>


</div>






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
gap-3
"

>

<BrainCircuit

className="text-cyan-400"

/>


<h2 className="text-xl font-semibold text-white">

AI Insights & Clinical Notes

</h2>


</div>




<div

className="
mt-5
rounded-xl
bg-black/20
p-5
"

>


<p

className="
text-sm
text-slate-400
"

>

Risk Trajectory

</p>


<div

className="
mt-2
flex
items-center
gap-3
"

>


<span

className="
text-3xl
font-bold
text-white
"

>

68%

</span>


<span

className="
text-emerald-400
"

>

↑ +12% YoY

</span>


</div>


</div>




<div

className="
mt-5
rounded-xl
border
border-white/10
bg-white/5
p-4
"

>


<p

className="
text-sm
text-slate-300
"

>

Dr. Sarah Chen:

</p>


<p

className="
mt-2
text-sm
text-slate-400
"

>

Patient requires continued monitoring and follow-up imaging.

</p>


</div>




<textarea

value={note}

onChange={(e)=>
setNote(e.target.value)
}

onKeyDown={handleKeyDown}

placeholder="Add a clinical note..."

className="
mt-5
min-h-[120px]
w-full
rounded-xl
bg-[#0B0F17]
border
border-white/10
p-4
text-white
outline-none
focus:border-cyan-400
"

/>



<button

onClick={saveNote}

className="
mt-3
flex
items-center
gap-2
rounded-xl
bg-[#00F0FF]
px-5
py-3
font-semibold
text-black
"

>

<Save size={18}/>

Save Note

</button>



{

message &&

<div

className="
mt-4
rounded-lg
bg-emerald-500/10
border
border-emerald-500/30
px-4
py-3
text-emerald-400
text-sm
"

>

{message}

</div>

}



</div>


</div>

)

}