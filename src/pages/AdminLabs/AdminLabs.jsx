import React, { useEffect, useState } from "react";
import { LabAPI } from "../../apis/LabAPI";
import { UserAPI } from "../../apis/UserAPI.js";
import useAuth from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";

import {
	Paper,
	Button,
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Container,
	TextField,
	Stack,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { styled } from "@mui/system";

const HoverableTableRow = styled(TableRow)`
	&:hover {
		cursor: pointer;
		background-color: lightgray;
	}
`;

function AdminLabs() {
	const { auth, setAuth } = useAuth();
	const navigate = useNavigate();
	const [open, setOpen] = React.useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const [error, setError] = useState(null);
	const [labs, setLabs] = useState([]);

	useEffect(() => {
		LabAPI.getAll().then(
			(labs) => setLabs(labs),
			console.log(labs)
			// (error) => window.flash(error.message, "error")
		);
	}, []);
	const goToLab = (lab) => {
		if (lab._id === auth.lab_id) {
			navigate("/");
			return;
		}
		UserAPI.adminLab(lab._id).then(
			(user) => {
				setAuth(user);
				window.flash(`Laboratory switched to ${lab.name}`, "success");
				navigate("/");
			},
			(error) => window.flash(error.message, "error")
		);
	};

	const createLab = (e) => {
		e.preventDefault();
		const { name, phone, email, suname, semail, spass } = e.target.elements;
		const formData = new FormData();
		formData.append("name", name.value);
		phone.value && formData.append("phone", phone.value);
		email.value && formData.append("email", email.value);
		formData.append("sup_username", suname.value);
		formData.append("sup_email", semail.value);
		formData.append("sup_password", spass.value);
		LabAPI.createLab(formData).then(
			(newLab) => {
				setLabs([newLab, ...labs]);
				handleClose();
			},
			(error) => window.flash(error.message, "error")
		);
	};

	return (
		<div>
			<Container sx={{ marginTop: "50px" }}>
				<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
					<Button
						variant="contained"
						onClick={handleClickOpen}
						endIcon={<AddIcon />}
					>
						New
					</Button>
				</Box>
			</Container>

			<Container maxWidth="lg" sx={{ marginTop: "50px" }}>
				<Typography variant="h4" gutterBottom>
					Labs
				</Typography>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell align="left">Phone</TableCell>
								<TableCell align="left">Email</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{labs.map((lab) => (
								<HoverableTableRow
									key={lab._id}
									onClick={() => goToLab(lab)}
									sx={{
										"&:last-child td, &:last-child th": { border: 0 },
										backgroundColor:
											lab._id === auth.lab_id
												? "lightblue"
												: "transparent", // Set different background color for the lab we are in
										cursor:
											lab._id === auth.lab_id
												? "default"
												: "pointer", // Disable cursor pointer for the lab we are in
									}}
								>
									<TableCell component="th" scope="row">
										{lab.name}
									</TableCell>
									<TableCell align="left">{lab.phone}</TableCell>
									<TableCell align="left">{lab.email}</TableCell>
								</HoverableTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Container>
			<React.Fragment>
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>Create new laboratory</DialogTitle>
					<DialogContent>
						<Form onSubmit={createLab}>
							<Stack spacing={2}>
								<Stack direction="row" spacing={4}>
									<TextField
										label="Laboratory Name"
										type="text"
										variant="outlined"
										sx={{ width: "900px" }}
										name="name"
									/>
								</Stack>

								<Stack direction="row" spacing={2}>
									<TextField
										label="Phone Number"
										type="text"
										variant="outlined"
										sx={{ width: "400px" }}
										name="phone"
									/>
									<TextField
										label="Email Address"
										type="email"
										variant="outlined"
										sx={{ width: "400px" }}
										name="email"
									/>
								</Stack>
								<Stack direction="row" spacing={4}>
									<TextField
										label="Supervisor Username"
										type="text"
										variant="outlined"
										sx={{ width: "900px" }}
										name="suname"
									/>
								</Stack>
								<Stack direction="row" spacing={2}>
									<TextField
										label="Supervisor Email"
										type="email"
										variant="outlined"
										sx={{ width: "400px" }}
										name="semail"
									/>
									<TextField
										label="Supervisor Password	"
										type="password"
										variant="outlined"
										sx={{ width: "400px" }}
										name="spass"
									/>
								</Stack>
								<Stack direction="row" spacing={4}>
									<Button type="submit">Save</Button>
									<Button onClick={handleClose}>Cancel</Button>
								</Stack>
							</Stack>
						</Form>
					</DialogContent>
				</Dialog>
			</React.Fragment>
		</div>
	);
}
export default AdminLabs;
