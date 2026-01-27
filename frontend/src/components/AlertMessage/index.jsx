import { Alert } from 'react-bootstrap';
import "./index.css";

const AlertMessage = ({ message }) => {
	return (
		<Alert variant="info" className='alert-container'>
			<Alert.Heading className='alert-message'>
				{message}
			</Alert.Heading>
		</Alert>
	)
}

export default AlertMessage;