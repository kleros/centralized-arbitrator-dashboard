import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC } from "react"
import TimeAgo from "react-timeago"

const NotificationItem: FC<{text: string; time: number}> = (p) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-1">
          <label>
            <FontAwesomeIcon className="primary-inverted" icon="check-circle" />
          </label>
        </div>
        String
        <div className="col-10">
          <label>{p.text}</label>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <sub className="float-right primary-inverted">
            <b>
              <TimeAgo date={p.time} maxPeriod={3600} minPeriod={5} />
            </b>
          </sub>
        </div>
      </div>
      <hr />
    </div>
  )
}

export default NotificationItem
