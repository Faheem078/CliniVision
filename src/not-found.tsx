import Link from "next/link";
import {
  BrainCircuit,
  ArrowLeft
} from "lucide-react";


export default function NotFound(){

  return (

    <main
      className="
      min-h-screen
      bg-[#0B0F17]
      flex
      items-center
      justify-center
      p-6
      "
    >

      <div
        className="
        max-w-md
        w-full
        bg-[#0F172A]
        border
        border-white/10
        rounded-3xl
        p-10
        text-center
        backdrop-blur-xl
        "
      >

        <BrainCircuit
          className="
          mx-auto
          text-[#00F0FF]
          mb-6
          "
          size={64}
        />


        <h1
          className="
          text-5xl
          font-bold
          text-white
          "
        >
          404
        </h1>


        <p
          className="
          mt-4
          text-slate-400
          "
        >
          The requested diagnostic workspace could not be found.
        </p>


        <Link

          href="/dashboard"

          className="
          mt-8
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-[#00F0FF]
          px-6
          py-3
          font-semibold
          text-[#061018]
          hover:shadow-[0_0_30px_rgba(0,240,255,.4)]
          transition
          "
        >

          <ArrowLeft size={18}/>

          Return Dashboard

        </Link>


      </div>


    </main>

  );

}