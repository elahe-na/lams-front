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
	Container,
	FormControlLabel,
	Switch,
	Tooltip,
	IconButton,
	Typography,
	TextField,
	Stack,
	Breadcrumbs,
	Link,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import React, { useEffect, useState, useReducer } from "react";
import { DepAPI } from "../../apis/DepAPI";
import { Form } from "react-bootstrap";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.white,
		color: theme.palette.common.black,
		fontSize: 15,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		// border: 0,
	},
}));

function Department() {
	const [switchValue, setSwitchValue] = useState(false);
	const [selectedDep, setSelectedDep] = useState(null);
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [deps, setDeps] = useState([]);

	useEffect(() => {
		DepAPI.getAll().then(
			(deps) => setDeps(deps),
			(error) => window.flash(error.message, "error")
		);
	}, []);
	const handleEditClick = (dep) => {
		setSelectedDep(dep);
		handleOpen();
	};
	const handleCancel = () => {
		setSelectedDep(null);
		handleClose();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const { value: name } = e.target.elements.name;
		if (selectedDep) {
			DepAPI.updateDep(selectedDep._id, name).then(
				(updatedDep) => {
					const updatedDeps = deps.map((dep) =>
						dep._id === selectedDep._id
							? { ...dep, name: updatedDep.name }
							: dep
					);
					setSelectedDep(null);
					setDeps(updatedDeps);
					handleClose();
				},
				(error) => window.flash(error.message, "error")
			);
		} else {
			DepAPI.createDep(name).then(
				(dep) => setDeps([dep, ...deps]),
				(error) => window.flash(error.message, "error")
			);
		}
	};

	const deleteHandler = (i) => {
		const { _id } = deps[i];
		DepAPI.deleteDep(_id).then(
			(dep) => setDeps(deps.filter((dep) => dep._id !== _id)),
			(error) => window.flash(error.message, "error")
		);
	};

	return (
		<>
			<Box m={2}>
				<Breadcrumbs
					aria-label="breadcrumb"
					separator={<NavigateNextIcon fontSize="small" />}
					maxItems={2}
					itemsAfterCollapse={2}
				>
					<Typography color="gray">Settings</Typography>

					<Typography color="text.primary">Department</Typography>
				</Breadcrumbs>
			</Box>
			<Container sx={{ marginTop: "50px" }}>
				<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
					<Button
						variant="contained"
						onClick={handleOpen}
						endIcon={<AddIcon />}
					>
						New
					</Button>
				</Box>
			</Container>
			<Container maxWidth="lg" sx={{ marginTop: "50px" }}>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Name</StyledTableCell>
								<StyledTableCell align="left">
									Enable/Disable
								</StyledTableCell>
								<StyledTableCell align="left">Edit</StyledTableCell>
								<StyledTableCell align="left">Delete</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{deps.map((dep, i) => (
								<TableRow
									key={dep._id}
									sx={{
										"&:last-child td, &:last-child th": { border: 0 },
									}}
								>
									<TableCell component="th" scope="row">
										{dep.name}
									</TableCell>
									<TableCell align="left">
										<FormControlLabel
											control={
												<Switch
													// checked={switchValue}
													// onChange={(event) =>
													// 	setSwitchValue(event.target.checked)
													// }
													size="large"
													color="primary"
												/>
											}
										/>
									</TableCell>
									<TableCell align="left">
										<Tooltip
											title="Edit"
											placement="right"
											arrow
											enterDelay={500}
											leaveDelay={200}
										>
											<IconButton
												onClick={() => handleEditClick(dep)}
											>
												<EditIcon />
											</IconButton>
										</Tooltip>
									</TableCell>
									<TableCell align="left">
										<Tooltip
											title="Delete"
											placement="right"
											arrow
											enterDelay={500}
											leaveDelay={200}
											onClick={() => deleteHandler(i)}
										>
											<IconButton>
												<DeleteIcon />
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Container>
			<React.Fragment>
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>
						{selectedDep ? "Edit Department" : "Create New Department"}
					</DialogTitle>
					<DialogContent>
						<Form onSubmit={handleSubmit}>
							<Stack spacing={4}>
								<Stack spacing={3}>
									<TextField
										label="Name"
										name="name"
										variant="outlined"
										sx={{ width: "400px" }}
										defaultValue={selectedDep ? selectedDep.name : ""}
									/>
								</Stack>
								<Stack spacing={2} direction="row">
									<Button onClick={handleClose} type="submit">
										{selectedDep ? "Update" : "Save"}
									</Button>
									<Button onClick={handleCancel}>Cancel</Button>
								</Stack>
							</Stack>
						</Form>
					</DialogContent>
				</Dialog>
			</React.Fragment>
		</>
	);
}
export default Department;
