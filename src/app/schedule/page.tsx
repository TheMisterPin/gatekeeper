"use client"

import AppShell from "@/components/app-shell"
import AppointmentsMainView from "@/components/appointments-main-view"
import ArrivalCheckInModal from "@/components/arrival-check-in-modal"
import { HeaderLogo } from "@/components/layout-elements/header-logo"
import { useScheduleController } from "@/hooks/useScheduleController"

export default function SchedulePage() {
	const {
		isAuthenticated,
		currentUserName,
		handleLogout,
		searchTerm,
		setSearchTerm,
		selectedEmployeeId,
		setSelectedEmployeeId,
		selectedDateFilter,
		setSelectedDateFilter,
		hostOptions,
		dateOptions,
		groupedAppointments,
		appointmentsLoading,
		handleAppointmentClick,
		handleCloseArrivalModal,
		selectedAppointment,
		arrivalAppointmentInfo,
		mainConsentChecked,
		setMainConsentChecked,
		biometricConsentChecked,
		setBiometricConsentChecked,
		isCameraActive,
		capturedImageUrl,
		videoRef,
		startCamera,
		stopCamera,
		capturePhoto,
		handleConfirmCheckIn,
		handleDownloadBadge,
		todayLabel,
		checkInLoading,
	} = useScheduleController()

	if (!isAuthenticated) {
		return null
	}

	return (
		<AppShell
			logo={<HeaderLogo />}
			currentUserName={currentUserName}
			onLogout={handleLogout}
			navItems={[
				{ id: "dashboard", label: "Dashboard", isActive: true },
				{ id: "history", label: "Storico", isActive: false },
			]}
			onNavItemClick={(id) => {
				console.log("Nav click", id)
			}}
		>
			<AppointmentsMainView
				searchTerm={searchTerm}
				selectedEmployeeId={selectedEmployeeId}
				selectedDateFilter={selectedDateFilter}
				hostOptions={hostOptions}
				dateOptions={dateOptions}
				groupedAppointments={groupedAppointments}
				onSearchTermChange={setSearchTerm}
				onEmployeeFilterChange={setSelectedEmployeeId}
				onDateFilterChange={setSelectedDateFilter}
				onAppointmentClick={handleAppointmentClick}
				loading={appointmentsLoading}
			/>

			<ArrivalCheckInModal
				open={selectedAppointment != null}
				onClose={handleCloseArrivalModal}
				appointment={arrivalAppointmentInfo}
				mainConsentChecked={mainConsentChecked}
				biometricConsentChecked={biometricConsentChecked}
				onMainConsentChange={setMainConsentChecked}
				onBiometricConsentChange={setBiometricConsentChecked}
				isCameraActive={isCameraActive}
				capturedImageUrl={capturedImageUrl || undefined}
				videoRef={videoRef}
				onCameraToggle={() => {
					if (isCameraActive) {
						stopCamera()
					} else {
						void startCamera()
					}
				}}
				onCapturePhoto={capturePhoto}
				onConfirmCheckIn={handleConfirmCheckIn}
				onDownloadBadge={handleDownloadBadge}
				todayLabel={todayLabel}
				loading={checkInLoading}
			/>
		</AppShell>
	)
}
