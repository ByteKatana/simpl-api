export default function ContentCard(param) {
  const { img, content, img_width } = param
  return (
    <div className="flex flex-row flex-nowrap">
      <div id="icon">
        <img data-testid={"img"} src={`img/${img}`} width={`${img_width}`} alt="Entry Types Image" />
      </div>
      <div id="content" className="flex block">
        <div data-testid={"content"} className=" w-96 ">
          {content}
        </div>
      </div>
    </div>
  )
}
