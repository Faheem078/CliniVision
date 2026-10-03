"use client";


interface Insight{

label:string;

value:string;

}



const insights:Insight[]=[

{
label:"Detection Confidence",
value:"98%"
},

{
label:"Restricted Diffusion",
value:"Detected"
},

{
label:"Stroke Territory",
value:"Left MCA"
},

{
label:"Priority",
value:"Critical Review"
}

];



export default function AIInsights(){


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
text-lg
font-semibold
text-white
"

>

AI Diagnostic Summary

</h3>



<div

className="
mt-5
space-y-4
"

>


{

insights.map((item)=>(


<div

key={item.label}

className="
flex
justify-between
border-b
border-white/10
pb-3
"

>


<span

className="
text-slate-400
text-sm
"

>

{item.label}

</span>


<span

className="
text-white
font-medium
"

>

{item.value}

</span>


</div>


))


}


</div>


</div>


)

}