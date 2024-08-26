const ProgressPane = ({ className, title }: {
  className?: string
  title: string
}) => {
  return (
    <>
      <style jsx>{`
          div.state-active::before { 
            background-color: #040c13; 
            content: ""; 
            height: 4px; 
            display:block; 
            margin-bottom: 8px;
          }
          div.state-active {
            color:black; 
          }
          div.state-active>p { font-weight:bold }
          div {
            color:#72757e; 
          }
          div::before { 
            background-color: #c8cad0; 
            content: ""; 
            height: 4px; 
            display:block; 
            margin-bottom: 8px;
          }

        `}</style>
      <div className={`${className} w-full`}>
        <p className="text-[14px] leading-5 overflow-ellipsis overflow-x-hidden">{title}</p> {/* whitespace-nowrap */}
      </div>
    </>
  )
}
export default ProgressPane;