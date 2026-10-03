"use client";


import {

BrainCircuit,
Activity,
Layers

} from "lucide-react";



export default function ReportInsightsPanel(){


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
flex
items-center
gap-2
"

>

<BrainCircuit

className="text-cyan-400"

/>

AI Insights

</h2>





<div

className="
grid
grid-cols-2
gap-4
"

>


<div

className="
rounded-xl
bg-white/5
border
border-white/10
p-4
"

>

<p className="text-xs text-slate-400">

Volume Estimate

</p>


<p className="mt-2 text-2xl font-bold text-white">

32.4 cm³

</p>


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

<p className="text-xs text-slate-400">

ASPECTS Score

</p>


<p className="mt-2 text-2xl font-bold text-white">

6/10

</p>


</div>


</div>





<div>


<h3

className="
text-white
font-medium
"

>

Similar Anonymized Cases

</h3>



<div

className="
mt-4
space-y-3
"

>


<div

className="
rounded-xl
bg-black/20
p-4
"

>

<p className="text-white">

Case #882-91

</p>


<p className="text-sm text-cyan-300">

94% match

</p>


</div>




<div

className="
rounded-xl
bg-black/20
p-4
"

>

<p className="text-white">

Case #102-4A

</p>


<p className="text-sm text-cyan-300">

87% match

</p>


</div>


</div>


</div>




<div

className="
border-t
border-white/10
pt-5
"

>


<div

className="
flex
items-center
gap-2
text-sm
text-slate-400
"

>

<Activity size={16}/>

NeuroScan v4.2

</div>



<div

className="
mt-3
flex
items-center
gap-2
text-sm
text-slate-400
"

>

<Layers size={16}/>

Deep Learning Model Active

</div>



</div>




</div>

)

}