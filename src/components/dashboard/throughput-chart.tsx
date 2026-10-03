"use client";


const bars=[40,65,35,85,70,95,50];



export default function ThroughputChart(){


return (

<div

className="
rounded-2xl
border
border-white/10
bg-[#0F172A]
p-6
"

>


<h3

className="
text-xl
font-semibold
text-white
"

>
Throughput Trend
</h3>


<p className="text-sm text-slate-400 mt-2">
Scans processed past 24h
</p>



<div

className="
mt-8
flex
items-end
gap-3
h-40
"

>


{
bars.map((height,index)=>(


<div

key={index}

className="
flex-1
rounded-t-lg
bg-cyan-400/50
"

style={{

height:`${height}%`

}}

/>


))

}


</div>


<div className="flex justify-between mt-4 text-xs text-slate-400">

<span>
00:00
</span>

<span>
12:00
</span>

<span>
Now
</span>


</div>


</div>


)

}