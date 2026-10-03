"use client";


import Link from "next/link";

import {
ArrowRight
} from "lucide-react";


import {
mockScans
} from "@/data/mock-data";



export default function AnalysisTable(){


return (

<div

className="
rounded-2xl
border
border-white/10
bg-[#0F172A]
overflow-hidden
"

>


<div

className="
overflow-x-auto
"

>


<table

className="
w-full
text-left
"

>


<thead

className="
bg-white/5
text-xs
uppercase
text-slate-400
"

>

<tr>

<th className="px-6 py-4">
Patient
</th>


<th className="px-6 py-4">
Age / Gender
</th>


<th className="px-6 py-4">
Scan Date
</th>


<th className="px-6 py-4">
Condition
</th>


<th className="px-6 py-4">
AI Status
</th>


<th className="px-6 py-4">
Confidence
</th>


<th className="px-6 py-4">
Workspace
</th>


</tr>

</thead>



<tbody>


{

mockScans.map((scan)=>(


<tr

key={scan.id}

className="
border-t
border-white/10
hover:bg-white/5
transition
"

>


<td className="px-6 py-5">


<p className="text-white font-medium">
{scan.patientName}
</p>


<p className="text-xs text-slate-400">
{scan.scanId}
</p>


</td>



<td className="px-6 py-5 text-slate-300">

{scan.modality}

</td>



<td className="px-6 py-5 text-slate-400">

{scan.date}

</td>



<td className="px-6 py-5 text-white">

{scan.diagnosis}

</td>



<td className="px-6 py-5">


<span

className={`

rounded-full

px-3

py-1

text-xs

border

${
scan.status==="Normal"

?

"bg-emerald-500/10 text-[#4DE082] border-emerald-500/30"

:

"bg-rose-500/10 text-[#FFB4AB] border-rose-500/30"

}

`}

>

● {scan.status}

</span>


</td>




<td className="px-6 py-5">


<div className="w-32">


<div className="flex justify-between text-xs mb-1">

<span className="text-slate-400">
AI
</span>

<span className="text-white">
{scan.confidence}%
</span>

</div>


<div

className="
h-2
rounded-full
bg-slate-800
"

>

<div

className="
h-full
rounded-full
bg-cyan-400
"

style={{

width:`${scan.confidence}%`

}}

/>

</div>


</div>


</td>



<td className="px-6 py-5">


<Link

href={`/scans/${scan.id}`}

className="
inline-flex
items-center
gap-2
rounded-lg
bg-cyan-400
px-3
py-2
text-sm
font-medium
text-black
"

>

Open

<ArrowRight size={15}/>

</Link>


</td>



</tr>


))


}


</tbody>


</table>


</div>


</div>

)

}