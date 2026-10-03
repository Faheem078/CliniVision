"use client";


import {

Brain,

AlertTriangle,

Download

} from "lucide-react";



interface Props{

onExport?:()=>void;

}



export default function ReportViewer({

onExport

}:Props){



return (

<div

className="
rounded-2xl
border
border-white/10
bg-[#0F172A]
p-6
space-y-6
"

>



<h2

className="
text-xl
font-semibold
text-white
"

>

DICOM Preview

</h2>




<div

className="
relative
h-64
rounded-xl
overflow-hidden
bg-black
border
border-white/10
flex
items-center
justify-center
"

>



<div

className="
h-48
w-48
rounded-full
bg-gradient-to-br
from-slate-700
to-black
"

>



<div

className="
absolute
right-20
top-20
h-20
w-20
rounded-full
bg-rose-500/40
blur-xl
"

></div>


</div>





<span

className="
absolute
top-4
left-4
rounded-full
bg-rose-500/10
border
border-rose-500/30
px-3
py-1
text-xs
text-[#FFB4AB]
flex
items-center
gap-2
"

>


<AlertTriangle size={14}/>

Anomaly Detected


</span>




</div>





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
items-center
gap-3
"

>

<Brain

className="text-cyan-400"

/>


<div>

<p className="text-white font-medium">

MRI Brain w/wo Contrast

</p>


<p className="text-sm text-slate-400">

Restricted diffusion in left MCA territory

</p>


</div>


</div>


</div>





<button

onClick={onExport}

className="
w-full
flex
items-center
justify-center
gap-2
rounded-xl
bg-cyan-400
py-3
font-semibold
text-black
"

>

<Download size={18}/>

Export PDF Report

</button>



</div>

)

}