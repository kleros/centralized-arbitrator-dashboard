import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import TimeAgo from "react-timeago"

const NotificationItem = ({ text, time }: { text: string; time: number }) => {
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
          <label>{text}</label>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <sub className="float-right primary-inverted">
            <b>
              <TimeAgo date={time} maxPeriod={3600} minPeriod={5} />
            </b>
          </sub>
        </div>
      </div>
      <hr />
    </div>
  )
}

export default NotificationItem
