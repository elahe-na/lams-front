import { RootLayout } from "./layouts/RootLayout";
import Login from "./pages/Login";
import AdminLabs from "./pages/AdminLabs/AdminLabs";
import Equipment from "./pages/Equipment";
import Department from "./pages/Department";
import RequireAuth from "./components/RequireAuth";
import { Route, Routes } from "react-router-dom";

function App() {
	return (
		<>
			<Routes>
				<Route element={<RequireAuth />}>
					<Route path="/" element={<RootLayout />}>
						<Route path="laboratory" element={<AdminLabs />} />
						<Route path="equipment" element={<Equipment />} />
						<Route path="department" element={<Department />} />
					</Route>
				</Route>

				{/* PUBLIC ROUTES */}
				<Route path="/login" element={<Login />} />
				 {/*<Route path="*" element={<NotFound />} /> */}
			</Routes>
		</>
	);
}

export default App;
