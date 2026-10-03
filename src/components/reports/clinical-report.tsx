"use client";


import {

FileText,
Sparkles

} from "lucide-react";



interface Props {

report:{

clinicalHistory:string;

findings:{

brainParenchyma?:string;

ventricles?:string;

vasculature?:string;

general?:string;

};

impression:string;

};

editMode:boolean;

}




export default function ClinicalReport({

report,

editMode

}:Props){



return (

<div

className="
rounded-2xl
border
border-white/10
bg-[#0F172A]
p-6
space-y-8
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
gap-3
"

>


<FileText

className="text-cyan-400"

/>


<h2

className="
text-xl
font-semibold
text-white
"

>

Clinical Report

</h2>


</div>




<span

className="
rounded-full
bg-emerald-500/10
border
border-emerald-500/30
px-3
py-1
text-xs
text-[#4DE082]
"

>

AI Confidence High

</span>



</div>





<section>


<h3

className="
text-sm
uppercase
tracking-wide
text-slate-400
"

>

Clinical History

</h3>


<p

className="
mt-3
text-slate-200
leading-relaxed
"

>

{report.clinicalHistory}

</p>


</section>





<section>


<div

className="
flex
items-center
gap-2
"

>


<h3

className="
text-lg
font-semibold
text-white
"

>

Findings

</h3>



<span

className="
flex
items-center
gap-1
rounded-full
bg-cyan-400/10
border
border-cyan-400/30
px-3
py-1
text-xs
text-cyan-300
"

>

<Sparkles size={14}/>

Auto Generated

</span>


</div>




<div

className="
mt-5
space-y-4
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


<h4 className="text-white font-medium">

Brain Parenchyma

</h4>


<p className="mt-2 text-sm text-slate-400">

{report.findings.brainParenchyma}

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


<h4 className="text-white font-medium">

Ventricles and Extra-axial Spaces

</h4>


<p className="mt-2 text-sm text-slate-400">

{report.findings.ventricles}

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


<h4 className="text-white font-medium">

Vasculature

</h4>


<p className="mt-2 text-sm text-slate-400">

{report.findings.vasculature}

</p>


</div>



</div>


</section>





<section>


<h3

className="
text-lg
font-semibold
text-white
"

>

Impression

</h3>


{

editMode

?

<textarea

defaultValue={report.impression}

className="
mt-3
w-full
min-h-[120px]
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


:

<p

className="
mt-3
text-slate-300
"

>

{report.impression}

</p>


}



</section>




</div>

)

}