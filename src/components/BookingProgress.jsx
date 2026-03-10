export default function BookingProgress({step}){

  const steps = ["Identity","Rental Details","Payment"]

  return(

    <div className="flex items-center justify-between mb-10">

      {steps.map((label,index)=>{

        const stepNumber = index+1
        const active = step>=stepNumber

        return(

          <div key={index} className="flex-1 text-center">

            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center
              ${active ? "bg-blue-900 text-white":"bg-gray-200"}`}>

              {stepNumber}

            </div>

            <p className="text-sm mt-2">{label}</p>

          </div>
        )
      })}

    </div>
  )
}
