import React from 'react'
import styles from './TimeMeasurementStyle'
import Button from '../../atoms/Button'

class TimeMeasurement extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isMeasuring: false,
			startTime: null,
			currentTime: null,
			endTime: null,
			selectedTask: null,
			measurements: [],
			selectedTask: {}
		}

		this.startMeasurement = this.startMeasurement.bind(this)
		this.setSpendedTimeValue = this.setSpendedTimeValue.bind(this)
		this.stopMeasurement = this.stopMeasurement.bind(this)
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			selectedTask: newProps.selectedTask,
			measurements: newProps.selectedTask.measurements
		})
	}

	componentDidMount() {
		this.setState({
			selectedTask: this.props.selectedTask,
			measurements: this.props.selectedTask.measurements
		})
	}

	currenTime = () => new Date().getTime()

	startMeasurement() {
		this.setState(previousState => {
			return {
				isMeasuring: true,
				startTime: this.currenTime(),
				currenTime: this.currenTime(),
				measurements: [...previousState.measurements, {
					startTime: this.currenTime(),
					endTime: 0,
					isPosted: false
				}]
			}
		}, () => {
			this.setSpendedTimeValue()
		})
	}

	setSpendedTimeValue(isTiming) {
		this.interval = setInterval(() => {
			this.setState({
				currenTime: this.currenTime()
			}, () => {
				console.log('currenTime: ', this.state.currenTime)
			})
		}, 500)
	}

	stopMeasurement() {
		this.setState({
			isMeasuring: false,
			endTime: this.state.currenTime
		}, () => {
			this.props.putNewTimeMeasurement(this.props.selectedTask._id, this.state.startTime, this.state.endTime)
			clearInterval(this.interval)
		})
	}

	secondsToHourMinuteSecond(totalSeconds) {
		let hour = Math.floor(totalSeconds / 3600);
		let minute = Math.floor(totalSeconds % 3600 / 60);
		let seconds = Math.floor(totalSeconds % 3600 % 60);

		return `${('0' + hour).slice(-2)}:${('0' + minute).slice(-2)}:${('0' + seconds).slice(-2)}`
	}

	render() {
		const { selectedTask } = this.props
		const { measurements } = selectedTask
		const totalInMiliSeconds = (endTime, startTime) => Math.floor(endTime - startTime)
		const totalInSeconds = (endTime, startTime) => Math.floor(totalInMiliSeconds(endTime, startTime) / 1000)

		return (
			<div className="time-measurement-container">
				{ selectedTask !== null ?
				<ul className="time-measurements">

					{this.state.measurements.map((timeObject, idx) =>

						<li key={idx}>
							<label>Measurement:</label>
							<span>
								{
									timeObject.isPosted ?
									<span>{ this.secondsToHourMinuteSecond(totalInSeconds(timeObject.endTime, timeObject.startTime)) }</span>
									:
									<span>{ this.secondsToHourMinuteSecond(totalInSeconds(this.state.currenTime, timeObject.startTime)) }</span>
								}
							</span>
						</li>

					)}

					<div className="measurement-controls">

						{<span className="total-measurement">
							{ selectedTask.totalTime !== undefined &&
							<span>
								<label>Total measured time:</label>
								<span>{}</span>
							</span>
							}
						</span>}

						<span>
							{this.state.isMeasuring ?
								<Button text="Cancel" type="cancel" onClick={e => this.stopMeasurement()}/>
								:
								<Button text="Start time measurement" type="submit" onClick={e => this.startMeasurement()}/>
							}

						</span>
					</div>

				</ul>
				: null}
				<style jsx>{ styles }</style>
			</div>
		)
	}
}

export default TimeMeasurement;
