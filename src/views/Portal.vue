<template>
    <div>
        <BlockViewer header="">
            <div class="surface-section px-4 py-4 md:px-6 lg:px-4 text-center">
                <div class="mb-3 font-bold text-2xl">
                    <span class="text-900">Welcome to the DOST-IX </span>
                    <span class="text-blue-600">Web Portal</span>
                </div>
                <div class="text-700 text-md mb-6">
                    This portal serves as an online directory of web applications currently deployed to DOST-IX. <br />
                    Select the web application you wish to access. (some applications may require login credentials - contact your system administrator if you don't have one).
                </div>
                <div class="grid">
                    <div class="col-12 md:col-4 mb-4 px-5">
                        <a href="https://dms.dost9.ph" target="_blank">
                            <span class="p-3 shadow-2 mb-3 inline-block surface-card" style="border-radius: 10px">
                                <i class="pi pi-folder-open text-4xl text-blue-500"></i>
                            </span>
                        </a>
                        <div class="text-900 mb-3 font-medium">DMS</div>
                        <span class="text-700 text-sm line-height-3">Document Management System</span>
                    </div>
                    <div class="col-12 md:col-4 mb-4 px-5">
                        <a href="https://eulim.dost9.ph" target="_blank">
                            <span class="p-3 shadow-2 mb-3 inline-block surface-card" style="border-radius: 10px">
                                <i class="pi pi-check-square text-4xl text-blue-500"></i>
                            </span>
                        </a>
                        <div class="text-900 mb-3 font-medium">eULIMS</div>
                        <span class="text-700 text-sm line-height-3">Enhanced Unified Laboratory Information Management System</span>
                    </div>
                    <div class="col-12 md:col-4 mb-4 px-5">
                        <a href="https://faims2.dost9.ph" target="_blank">
                            <span class="p-3 shadow-2 mb-3 inline-block surface-card" style="border-radius: 10px">
                                <i class="pi pi-book text-4xl text-blue-500"></i>
                            </span>
                        </a>
                        <div class="text-900 mb-3 font-medium">FAIMS</div>
                        <span class="text-700 text-sm line-height-3">Finance and Administrative Information Management System</span>
                    </div>
                    <div class="col-12 md:col-4 mb-4 px-5">
                        <a href="http://dost9.ph:81" target="_blank">
                            <span class="p-3 shadow-2 mb-3 inline-block surface-card" style="border-radius: 10px">
                                <i class="pi pi-server text-4xl text-blue-500"></i>
                            </span>
                        </a>
                        <div class="text-900 mb-3 font-medium">File Server Online</div>
                        <span class="text-700 text-sm line-height-3">Online repository of DOST-IX files and documents.</span>
                    </div>
                    <div class="col-12 md:col-4 mb-4 px-5">
                        <a href="https://hrmis.dost9.ph" target="_blank">
                            <span class="p-3 shadow-2 mb-3 inline-block surface-card" style="border-radius: 10px">
                                <i class="pi pi-user text-4xl text-blue-500"></i>
                            </span>
                        </a>
                        <div class="text-900 mb-3 font-medium">HRMIS</div>
                        <span class="text-700 text-sm line-height-3">Human Resource Management Information System</span>
                    </div>
                    <div class="col-12 md:col-4 mb-4 px-5">
                        <a href="https://impression.dost9.ph" target="_blank">
                            <span class="p-3 shadow-2 mb-3 inline-block surface-card" style="border-radius: 10px">
                                <i class="pi pi-map text-4xl text-blue-500"></i>
                            </span>
                        </a>
                        <div class="text-900 mb-3 font-medium">IMPRESSION</div>
                        <span class="text-700 text-sm line-height-3">Information & Monitoring of Projects, Services and S&T Interventions.</span>
                    </div>
                    <div class="col-12 md:col-4 md:mb-4 mb-0 px-3">
                        <a href="https://scims.dost9.ph" target="_blank">
                            <span class="p-3 shadow-2 mb-3 inline-block surface-card" style="border-radius: 10px">
                                <i class="pi pi-shopping-cart text-4xl text-blue-500"></i>
                            </span>
                        </a>    
                        <div class="text-900 mb-3 font-medium">SCIMS</div>
                        <span class="text-700 text-sm line-height-3">
                            Stock Control and Inventory Management System.</span
                        >
                    </div>
                    <div class="col-12 md:col-4 md:mb-4 mb-0 px-3">
                        <a href="https://scholarship.dost9.ph" target="_blank">
                            <span class="p-3 shadow-2 mb-3 inline-block surface-card" style="border-radius: 10px">
                                <i class="pi pi-star text-4xl text-blue-500"></i>
                            </span>
                        </a>
                        <div class="text-900 mb-3 font-medium">SCHOLARSHIP</div>
                        <span class="text-700 text-sm line-height-3">
                            Scholarship Information Management System</span>
                    </div>
                    <div class="col-12 md:col-4 mb-4 px-5">
                        <a href="https://trace.dost9.ph" target="_blank">
                            <span class="p-3 shadow-2 mb-3 inline-block surface-card" style="border-radius: 10px">
                                <i class="pi pi-file-export text-4xl text-blue-500"></i>
                            </span>
                        </a>
                        <div class="text-900 mb-3 font-medium">TRACE</div>
                        <span class="text-700 text-sm line-height-3">Tracking, Retrieval, Archiving of Communications for Efficiency</span>
                    </div>
                    <div class="col-12 md:col-4 mb-4 px-5">
                        <a href="https://vrams.dost9.ph" target="_blank">
                            <span class="p-3 shadow-2 mb-3 inline-block surface-card" style="border-radius: 10px">
                                <i class="pi pi-car text-4xl text-blue-500"></i>
                            </span>
                        </a>    
                        <div class="text-900 mb-3 font-medium">VRAMS</div>
                        <span class="text-700 text-sm line-height-3">Vehicle Reservation and Management System.</span>
                    </div>
                </div>
            </div>
        </BlockViewer>
    </div>
</template>
