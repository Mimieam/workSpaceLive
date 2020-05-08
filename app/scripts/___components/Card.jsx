// width: 80vw;
// width: -webkit-fill-available;
//     position: absolute;
//     margin: 10px;
//     /* margin-right: 20px; */
//     height: 100%;
//     top: 0;
// right: 0;
    
export const Card = props => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg  bg-white">
      <div className=".rounded-t-lg px-6 py-2 text-right bg-gray-900 h-10 font-bold text-gray-200 text-xl mb-2">
        Tab Header
    </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Tabs Header</div>
        <div className="text-gray-700 text-base">
          { props.children }
        </div>
      </div>
      <div className="px-6 py-4">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#finance</span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#reseach</span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">#life</span>
      </div>
    </div>
  )
}