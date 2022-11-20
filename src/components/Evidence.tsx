import mime from "mime"
import { FC } from "react"

const Evidence: FC<{
  fileURI: string
  ipfsGateway: string
  name: string
  //description: string
  //evidenceJSONValid: boolean
  //fileHash: string
}> = (p) => {
  const typeToIcon = (type: string) => {
    console.log("typetoicon")
    console.log(type)
    switch (type) {
      case "video":
        return "video.svg"
      case "image":
        return "image.svg"
      default:
        return "text.svg"
    }
  }

  return (
    <a
      href={p.ipfsGateway + p.fileURI}
      rel="noopener noreferrer"
      target="_blank"
      style={{ fontSize: "0.6em" }}
    >
      <>
        <img
          alt=""
          className="mr-3"
          style={{ maxHeight: "1em", verticalAlign: "text-bottom" }}
          src={typeToIcon(
            mime.lookup(p.fileURI.split(".")[1]).toString().split("/")[0]
          )}
        />
        {p.name}
      </>
    </a>
  )
}

export default Evidence
