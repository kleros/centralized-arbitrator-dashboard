import mime from "mime"

const Evidence = ({
  /*description,
  evidenceJSONValid,
  fileHash,*/
  fileURI,
  ipfsGateway,
  name,
}: {
  /*description: string,
  evidenceJSONValid: boolean,
  fileHash: string,*/
  fileURI: string,
  ipfsGateway: string,
  name: string
}) => {
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
      href={ipfsGateway + fileURI}
      rel="noopener noreferrer"
      target="_blank"
      style={{ fontSize: "0.6em" }}
    >
      <img
        alt=""
        className="mr-3"
        style={{ maxHeight: "1em", verticalAlign: "text-bottom" }}
        src={typeToIcon(
          mime.lookup(fileURI.split(".")[1]).toString().split("/")[0]
        )}
      />

      {name}
    </a>
  )
}

export default Evidence