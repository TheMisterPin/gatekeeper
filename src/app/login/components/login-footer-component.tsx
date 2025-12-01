"use client"

import React from "react"
import { getVersion } from "@/utils/get-version"

export function LoginFooterComponent() {
	const version = getVersion()
	return (
		<div className="flex items-center justify-between bg-[#243242] text-white px-4 py-3 rounded-b-md mt-4">
			<div className="flex items-center gap-3">
				<img src="/resources/images/logos/bksolutions-logo-white.png" alt="BK Solutions" className="h-10" />
			</div>
			<div className="text-right text-sm">
				<div>www.bksolutions.eu</div>
				<div>info@bksolutions.eu</div>
				<div>Tel. +39.041.887.8159</div>
				<div>Versione: {version}</div>
			</div>
		</div>
	)
}

export default LoginFooterComponent

