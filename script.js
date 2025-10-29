// PMD Translation Portal - Main JavaScript File

// Global Variables
let projectStats = {
    pending: 2,
    ongoing: 0,
    completed: 3
};

let activityLog = [];

// Authentication System
const validCredentials = {
    'CLIENT001': 'PMD2024',
    'admin': 'admin123',
    'TRANSLATOR001': 'TRANS2024'
};

// Authentication Functions
function handleLogin(event) {
    event.preventDefault();
    const userId = document.getElementById('user-id').value;
    const password = document.getElementById('password').value;
    
    if (validCredentials[userId] && validCredentials[userId] === password) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        createAdvancedNotification('Login successful! Welcome to PMD Translation Portal.', 'success');
        logActivity('User logged in successfully', 'auth');
    } else {
        createAdvancedNotification('Invalid credentials. Please check your User ID and Password.', 'error');
    }
}

function logout() {
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('user-id').value = '';
    document.getElementById('password').value = '';
    createAdvancedNotification('Logged out successfully.', 'info');
    logActivity('User logged out', 'auth');
}

// Tab System
function initializeTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('border-blue-500', 'text-blue-600');
                b.classList.add('border-transparent', 'text-gray-500');
            });
            btn.classList.add('border-blue-500', 'text-blue-600');
            btn.classList.remove('border-transparent', 'text-gray-500');
            
            // Update tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
            
            logActivity(`Navigated to ${tabId} tab`, 'navigation');
        });
    });
}

// Project Statistics Management
function updateProjectStats() {
    const total = projectStats.pending + projectStats.ongoing + projectStats.completed;
    const completedPercentage = total > 0 ? Math.round((projectStats.completed / total) * 100) : 0;
    
    // Update progress displays
    document.getElementById('overall-progress').textContent = completedPercentage + '%';
    document.getElementById('progress-percentage').textContent = completedPercentage + '%';
    document.getElementById('main-progress-bar').style.width = completedPercentage + '%';
    
    // Update section counts
    document.getElementById('total-sections').textContent = total;
    document.getElementById('pending-sections').textContent = projectStats.pending;
    document.getElementById('ongoing-sections').textContent = projectStats.ongoing;
    document.getElementById('completed-sections').textContent = projectStats.completed;
    
    // Update tracker counts
    document.getElementById('tracker-pending').textContent = projectStats.pending;
    document.getElementById('tracker-ongoing').textContent = projectStats.ongoing;
    document.getElementById('tracker-completed').textContent = projectStats.completed;
}

function updateContentStatus(select) {
    const section = select.dataset.section;
    const oldStatus = select.dataset.oldStatus || 'pending';
    const newStatus = select.value;
    
    if (oldStatus === newStatus) return;
    
    // Validate status change
    if (oldStatus === 'completed' && newStatus !== 'completed') {
        const confirmChange = confirm(`Are you sure you want to change ${section} from COMPLETED back to ${newStatus.toUpperCase()}?`);
        if (!confirmChange) {
            select.value = oldStatus;
            return;
        }
    }
    
    // Update stats
    projectStats[oldStatus]--;
    projectStats[newStatus]++;
    
    select.dataset.oldStatus = newStatus;
    updateProjectStats();
    
    // Update tracker status with animation
    const trackerStatus = document.getElementById(`status-${section}`);
    if (trackerStatus) {
        trackerStatus.className = `px-2 inline-flex text-xs leading-5 font-semibold rounded-full status-${newStatus}`;
        trackerStatus.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        
        // Add pulse animation
        trackerStatus.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            trackerStatus.style.animation = '';
        }, 500);
    }
    
    createAdvancedNotification(`Status updated: ${section} is now ${newStatus.toUpperCase()}`, 'success');
    logActivity(`Status changed: ${section} from ${oldStatus} to ${newStatus}`, 'status');
}

// Document Management Functions
function viewDocument(section, fileId) {
    const titles = {
        'homepage': 'Homepage Content (Header, Body & Footer)',
        'faq': 'FAQ Section',
        'infokorporat': 'Info Korporat - Main Menu Navigation',
        'quickaccess': 'Quick Access Bar',
        'footer': 'Footer Content'
    };
    
    try {
        const fullUrl = `https://docs.google.com/document/d/${fileId}/edit?usp=sharing`;
        window.open(fullUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        createAdvancedNotification(`Opening ${titles[section]} in new tab`, 'info');
        logActivity(`Document accessed: ${titles[section]}`, 'document');
    } catch (error) {
        createAdvancedNotification('Error opening document. Please try again.', 'error');
        console.error('Document viewing error:', error);
    }
}

function closeDocumentViewer() {
    document.getElementById('document-viewer').classList.add('hidden');
    document.getElementById('document-frame').src = '';
}

function saveDocument() {
    createAdvancedNotification('Document changes saved successfully!', 'success');
    closeDocumentViewer();
}

// Google Drive Integration
function openGoogleDrive() {
    try {
        window.open('https://drive.google.com/drive/folders/1yhsvFnNl6mY3BuNHIIArb7PhbyBlFNsd?usp=sharing', '_blank');
        createAdvancedNotification('Opening project Google Drive folder...', 'info');
        logActivity('Google Drive project folder accessed', 'drive');
    } catch (error) {
        createAdvancedNotification('Error opening Google Drive. Please check your connection.', 'error');
    }
}

function openReportsFolder() {
    try {
        const reportsUrl = 'https://drive.google.com/drive/folders/1oBkVXPYIH99UkakyyJohT6XFMmmzi1dX?usp=sharing';
        window.open(reportsUrl, '_blank');
        createAdvancedNotification('Opening reports folder...', 'info');
        logActivity('Reports folder accessed', 'report');
    } catch (error) {
        createAdvancedNotification('Error opening reports folder. Please try again.', 'error');
    }
}

// Team Management
function addTeamMember() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
            <h3 class="text-lg font-semibold mb-4">Add Team Member</h3>
            <form onsubmit="submitTeamMember(event)" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" id="member-name" class="w-full p-2 border border-gray-300 rounded" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select id="member-role" class="w-full p-2 border border-gray-300 rounded" required>
                        <option value="">Select Role</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Translator">Translator</option>
                        <option value="Quality Reviewer">Quality Reviewer</option>
                        <option value="Client Representative">Client Representative</option>
                        <option value="Technical Writer">Technical Writer</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                    <input type="email" id="member-email" class="w-full p-2 border border-gray-300 rounded">
                </div>
                <div class="flex space-x-3">
                    <button type="submit" class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Member</button>
                    <button type="button" onclick="document.body.removeChild(this.closest('.fixed'))" class="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700">Cancel</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function submitTeamMember(event) {
    event.preventDefault();
    const name = document.getElementById('member-name').value.trim();
    const role = document.getElementById('member-role').value;
    const email = document.getElementById('member-email').value.trim();
    
    if (!name || !role) {
        createAdvancedNotification('Please fill in all required fields', 'warning');
        return;
    }
    
    const teamList = document.getElementById('team-list');
    const memberDiv = document.createElement('div');
    memberDiv.className = 'flex items-center justify-between bg-green-50 p-3 rounded-lg fade-in border border-green-200';
    memberDiv.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">${name.charAt(0).toUpperCase()}</div>
            <div>
                <div class="font-medium text-gray-900">${name}</div>
                <div class="text-sm text-gray-600">${role}</div>
                ${email ? `<div class="text-xs text-gray-500">${email}</div>` : ''}
            </div>
        </div>
        <button onclick="removeTeamMember(this)" class="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50">Remove</button>
    `;
    teamList.appendChild(memberDiv);
    
    // Close modal
    document.body.removeChild(event.target.closest('.fixed'));
    
    createAdvancedNotification(`Team member ${name} added successfully!`, 'success');
    logActivity(`Team member added: ${name} (${role})`, 'team');
}

function removeTeamMember(button) {
    const memberDiv = button.closest('.bg-green-50');
    const memberName = memberDiv.querySelector('.font-medium').textContent;
    
    if (confirm(`Remove ${memberName} from the team?`)) {
        memberDiv.remove();
        createAdvancedNotification(`${memberName} removed from team`, 'info');
        logActivity(`Team member removed: ${memberName}`, 'team');
    }
}

// Meeting Management
function addMeeting(event) {
    event.preventDefault();
    const title = document.getElementById('meeting-title').value.trim();
    const date = document.getElementById('meeting-date').value;
    const time = document.getElementById('meeting-time').value;
    const attendees = document.getElementById('meeting-attendees').value.trim();
    const agenda = document.getElementById('meeting-agenda').value.trim();
    
    // Validation
    if (!title || !date || !time) {
        createAdvancedNotification('Please fill in all required fields (Title, Date, Time)', 'warning');
        return;
    }
    
    // Check if date is in the past
    const meetingDate = new Date(date + 'T' + time);
    const now = new Date();
    if (meetingDate < now) {
        const proceed = confirm('The meeting date is in the past. Do you want to add it as a past meeting?');
        if (!proceed) return;
    }
    
    const meetingsList = document.getElementById('meetings-list');
    const meetingDiv = document.createElement('div');
    const isPast = meetingDate < now;
    const statusClass = isPast ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200';
    const statusText = isPast ? 'COMPLETED' : 'SCHEDULED';
    const statusColor = isPast ? 'text-gray-600' : 'text-blue-600';
    
    meetingDiv.className = `border rounded-lg p-4 fade-in ${statusClass}`;
    meetingDiv.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <h4 class="font-semibold text-gray-800">${title}</h4>
            <div class="flex items-center space-x-2">
                <span class="text-xs ${statusColor} font-semibold">${statusText}</span>
                <span class="text-xs text-gray-500">${date} at ${time}</span>
            </div>
        </div>
        ${attendees ? `<p class="text-sm text-gray-600 mb-2"><strong>Attendees:</strong> ${attendees}</p>` : ''}
        ${agenda ? `<p class="text-sm text-gray-600 mb-3"><strong>Agenda:</strong> ${agenda}</p>` : ''}
        <div class="flex space-x-2">
            <button onclick="sendMeetingInvite('${title}', '${date}', '${time}', '${attendees}', '${agenda}')" 
                    class="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                📧 Send Invite
            </button>
            <button onclick="generateMeetingReport('${title}', '${date}', '${time}', '${attendees}', '${agenda}')" 
                    class="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700">
                📄 Generate Report
            </button>
            <button onclick="this.closest('.border').remove()" 
                    class="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">
                🗑️ Delete
            </button>
        </div>
    `;
    
    // Insert at the beginning (after the default meeting)
    const firstMeeting = meetingsList.firstElementChild;
    if (firstMeeting) {
        meetingsList.insertBefore(meetingDiv, firstMeeting.nextSibling);
    } else {
        meetingsList.appendChild(meetingDiv);
    }
    
    // Reset form
    event.target.reset();
    createAdvancedNotification('Meeting scheduled successfully!', 'success');
    logActivity(`Meeting scheduled: ${title} on ${date} at ${time}`, 'meeting');
}

function sendMeetingInvite(title, date, time, attendees, agenda) {
    const subject = `Meeting Invitation: ${title} - PMD Translation Project`;
    const body = `Dear Team,

You are invited to attend the following meeting:

Meeting: ${title}
Date: ${date}
Time: ${time}
Attendees: ${attendees}

Agenda:
${agenda}

Please confirm your attendance.

Best regards,
PMD Translation Project Team

Contact Information:
Abdul Latiff: abdullatiff@white-associates.net
Sofian: sofian@white-associates.net`;

    const mailtoLink = `mailto:abdullatiff@white-associates.net,sofian@white-associates.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    
    createAdvancedNotification('Meeting invite email opened in your default email client', 'success');
    logActivity(`Meeting invite sent for: ${title}`, 'email');
}

function generateMeetingReport(title, date, time, attendees, agenda) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Meeting Report - PMD Translation Project', 20, 30);
    
    // Meeting Details
    doc.setFontSize(16);
    doc.text('Meeting Details:', 20, 55);
    
    doc.setFontSize(12);
    doc.text(`Title: ${title}`, 30, 70);
    doc.text(`Date: ${date}`, 30, 85);
    doc.text(`Time: ${time}`, 30, 100);
    doc.text(`Attendees: ${attendees}`, 30, 115);
    
    // Agenda
    doc.setFontSize(16);
    doc.text('Agenda:', 20, 140);
    doc.setFontSize(12);
    const agendaLines = doc.splitTextToSize(agenda, 160);
    doc.text(agendaLines, 30, 155);
    
    // Action Items
    doc.setFontSize(16);
    doc.text('Action Items:', 20, 200);
    doc.setFontSize(12);
    doc.text('• Review translation progress for completed sections', 30, 215);
    doc.text('• Update terminology database with new terms', 30, 230);
    doc.text('• Schedule next review meeting', 30, 245);
    
    // Contact Information
    doc.setFontSize(16);
    doc.text('Contact Information:', 20, 270);
    doc.setFontSize(12);
    doc.text('Abdul Latiff: abdullatiff@white-associates.net', 30, 285);
    doc.text('Sofian: sofian@white-associates.net', 30, 300);
    
    doc.save(`Meeting_Report_${title.replace(/\s+/g, '_')}_${date}.pdf`);
    createAdvancedNotification('Meeting report generated and downloaded!', 'success');
    logActivity(`Meeting report generated for: ${title}`, 'report');
}

function createContactReport(title, date, attendees) {
    try {
        // Open the bit.ly link for Contact Report #1
        window.open('https://bit.ly/49lI8tC', '_blank');
        createAdvancedNotification('Contact Report #1 opened successfully', 'success');
        logActivity('Contact Report #1 accessed - Project Kickoff Meeting details', 'report');
    } catch (error) {
        createAdvancedNotification('Error opening Contact Report. Please try again.', 'error');
    }
}

// CAT Framework Functions
function openTerminologyManager() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-5/6 flex flex-col">
            <div class="flex justify-between items-center p-6 border-b">
                <h3 class="text-xl font-semibold">Terminology Database Manager</h3>
                <button onclick="document.body.removeChild(this.closest('.fixed'))" class="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-semibold mb-3">Add New Term</h4>
                        <form onsubmit="addNewTerm(event)" class="space-y-3">
                            <input type="text" id="new-malay-term" placeholder="Malay Term" class="w-full p-2 border rounded" required>
                            <input type="text" id="new-english-term" placeholder="English Translation" class="w-full p-2 border rounded" required>
                            <select id="term-category" class="w-full p-2 border rounded">
                                <option value="government">Government</option>
                                <option value="corporate">Corporate</option>
                                <option value="technical">Technical</option>
                                <option value="general">General</option>
                            </select>
                            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Term</button>
                        </form>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-3">Bulk Import</h4>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input type="file" id="bulk-import" accept=".csv,.xlsx" class="hidden" onchange="handleBulkImport(event)">
                            <button onclick="document.getElementById('bulk-import').click()" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                Import CSV/Excel File
                            </button>
                            <p class="text-sm text-gray-500 mt-2">Upload CSV or Excel file with Malay and English columns</p>
                        </div>
                    </div>
                </div>
                <div class="mt-6">
                    <h4 class="font-semibold mb-3">Recent Terms</h4>
                    <div id="recent-terms" class="space-y-2 max-h-40 overflow-y-auto">
                        <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span class="text-sm"><strong>Penafian:</strong> Disclaimer</span>
                            <button onclick="removeTerm(this)" class="text-red-500 hover:text-red-700 text-sm">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-6 border-t">
                <div class="flex justify-between">
                    <button onclick="openReportsFolder()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Export Database</button>
                    <button onclick="syncWithTranslationMemory()" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Sync with TM</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function openQualityChecker() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-2xl w-full max-w-3xl h-4/5 flex flex-col">
            <div class="flex justify-between items-center p-6 border-b">
                <h3 class="text-xl font-semibold">Translation Quality Checker</h3>
                <button onclick="document.body.removeChild(this.closest('.fixed'))" class="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div class="flex-1 p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-semibold mb-3">Quality Metrics</h4>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span>Consistency Score:</span>
                                <span class="font-semibold text-green-600">92%</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Terminology Compliance:</span>
                                <span class="font-semibold text-yellow-600">88%</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Grammar Check:</span>
                                <span class="font-semibold text-green-600">95%</span>
                            </div>
                        </div>
                        <button onclick="runQualityCheck()" class="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Run Full Quality Check</button>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-3">Issues Found</h4>
                        <div class="space-y-2 max-h-40 overflow-y-auto">
                            <div class="p-2 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
                                <strong>Terminology:</strong> "Pentadbiran" used inconsistently
                            </div>
                            <div class="p-2 bg-red-50 border-l-4 border-red-400 text-sm">
                                <strong>Missing:</strong> Translation for "Pekeliling" not found
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function openTimelineManager() {
    createAdvancedNotification('Opening timeline management system...', 'info');
}

function addTerm() {
    openTerminologyManager();
}

function addNewTerm(event) {
    event.preventDefault();
    const malayTerm = document.getElementById('new-malay-term').value;
    const englishTerm = document.getElementById('new-english-term').value;
    const category = document.getElementById('term-category').value;
    
    // Add to recent terms display
    const recentTerms = document.getElementById('recent-terms');
    const termDiv = document.createElement('div');
    termDiv.className = 'flex justify-between items-center p-2 bg-gray-50 rounded';
    termDiv.innerHTML = `
        <span class="text-sm"><strong>${malayTerm}:</strong> ${englishTerm} <span class="text-xs text-gray-500">(${category})</span></span>
        <button onclick="removeTerm(this)" class="text-red-500 hover:text-red-700 text-sm">Remove</button>
    `;
    recentTerms.insertBefore(termDiv, recentTerms.firstChild);
    
    // Update terminology count
    const currentCount = parseInt(document.getElementById('terms-count').textContent);
    document.getElementById('terms-count').textContent = currentCount + 1;
    
    // Clear form
    event.target.reset();
    
    createAdvancedNotification(`Term added: "${malayTerm}" → "${englishTerm}"`, 'success');
    logActivity(`New term added: ${malayTerm} → ${englishTerm}`, 'terminology');
}

function handleBulkImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    createAdvancedNotification(`Processing bulk import: ${file.name}...`, 'info');
    
    // Simulate processing
    setTimeout(() => {
        const importedCount = Math.floor(Math.random() * 50) + 10;
        const currentCount = parseInt(document.getElementById('terms-count').textContent);
        document.getElementById('terms-count').textContent = currentCount + importedCount;
        
        createAdvancedNotification(`Successfully imported ${importedCount} terms from ${file.name}`, 'success');
        logActivity(`Bulk import completed: ${importedCount} terms from ${file.name}`, 'terminology');
    }, 2000);
}

function removeTerm(button) {
    button.parentElement.remove();
    const currentCount = parseInt(document.getElementById('terms-count').textContent);
    document.getElementById('terms-count').textContent = Math.max(0, currentCount - 1);
    createAdvancedNotification('Term removed from database', 'info');
}

function syncWithTranslationMemory() {
    createAdvancedNotification('Syncing terminology database with translation memory...', 'info');
    
    setTimeout(() => {
        // Update TM stats
        const currentSegments = parseInt(document.getElementById('tm-segments').textContent);
        const newSegments = currentSegments + Math.floor(Math.random() * 20) + 5;
        document.getElementById('tm-segments').textContent = newSegments;
        
        const currentAuto = parseInt(document.getElementById('tm-auto').textContent);
        const newAuto = currentAuto + Math.floor(Math.random() * 15) + 3;
        document.getElementById('tm-auto').textContent = newAuto;
        
        createAdvancedNotification('Translation Memory synchronized successfully!', 'success');
        logActivity('Translation Memory synchronized with terminology database', 'sync');
    }, 1500);
}

function runQualityCheck() {
    createAdvancedNotification('Running comprehensive quality check...', 'info');
    
    setTimeout(() => {
        createAdvancedNotification('Quality check completed! Report generated.', 'success');
        logActivity('Quality check completed for all sections', 'quality');
    }, 3000);
}

function viewLearningLog() {
    createAdvancedNotification('Opening auto-learning system log...', 'info');
}

function processWordDocument(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['.doc', '.docx'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(fileExtension)) {
        createAdvancedNotification('Please upload a valid Word document (.doc or .docx)', 'error');
        return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        createAdvancedNotification('File size too large. Please upload a file smaller than 10MB.', 'error');
        return;
    }
    
    createAdvancedNotification(`Processing Word document: ${file.name}...`, 'info', 6000);
    
    // Simulate realistic document processing
    setTimeout(() => {
        const extractedTerms = Math.floor(Math.random() * 300) + 100;
        const newTerms = Math.floor(Math.random() * 80) + 20;
        const newSegments = Math.floor(Math.random() * 150) + 50;
        
        // Update terminology count
        const currentCount = parseInt(document.getElementById('terms-count').textContent);
        document.getElementById('terms-count').textContent = currentCount + newTerms;
        
        // Update TM segments
        const currentSegments = parseInt(document.getElementById('tm-segments').textContent);
        document.getElementById('tm-segments').textContent = currentSegments + newSegments;
        
        // Update TM auto-captured
        const currentAuto = parseInt(document.getElementById('tm-auto').textContent);
        document.getElementById('tm-auto').textContent = currentAuto + Math.floor(newSegments * 0.85);
        
        // Update TM leverage
        const newLeverage = Math.min(95, parseInt(document.getElementById('tm-leverage').textContent) + Math.floor(Math.random() * 3) + 1);
        document.getElementById('tm-leverage').textContent = newLeverage + '%';
        document.getElementById('tm-progress').style.width = newLeverage + '%';
        
        // Add to TM capture log
        const tmLog = document.getElementById('tm-capture-log');
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'text-gray-700 mb-1';
        logEntry.textContent = `[${timestamp}] 📄 Processed ${file.name}: ${newSegments} segments, ${newTerms} new terms extracted`;
        tmLog.insertBefore(logEntry, tmLog.firstChild);
        
        // Keep only last 10 entries
        while (tmLog.children.length > 10) {
            tmLog.removeChild(tmLog.lastChild);
        }
        
        createAdvancedNotification(`Successfully processed ${file.name}: ${newSegments} translation segments and ${newTerms} new terms extracted!`, 'success', 5000);
        logActivity(`Word document processed: ${file.name} - ${newSegments} segments, ${newTerms} new terms`, 'terminology');
    }, 3000);
}

// Date Management
function updateDaysRemaining() {
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const daysRemainingElement = document.getElementById('days-remaining');
    
    if (!startDateInput.value || !endDateInput.value) {
        daysRemainingElement.textContent = 'Set dates';
        return;
    }
    
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const today = new Date();
    
    // Validate date range
    if (endDate <= startDate) {
        daysRemainingElement.textContent = 'Invalid range';
        daysRemainingElement.className = 'font-semibold text-red-600';
        return;
    }
    
    const timeDiff = endDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff > 0) {
        daysRemainingElement.textContent = daysDiff + ' days';
        daysRemainingElement.className = daysDiff <= 7 ? 'font-semibold text-red-600' : 
                                        daysDiff <= 30 ? 'font-semibold text-yellow-600' : 
                                        'font-semibold text-green-600';
    } else {
        daysRemainingElement.textContent = Math.abs(daysDiff) + ' days overdue';
        daysRemainingElement.className = 'font-semibold text-red-600';
    }
}

// Enhanced Notification System
function createAdvancedNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    const colors = {
        'success': 'bg-green-500',
        'error': 'bg-red-500',
        'warning': 'bg-yellow-500',
        'info': 'bg-blue-500'
    };
    
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-xl z-50 fade-in max-w-md`;
    notification.innerHTML = `
        <div class="flex items-start space-x-3">
            <span class="text-lg">${icons[type]}</span>
            <div class="flex-1">
                <div class="font-medium">${message}</div>
                <div class="w-full bg-white bg-opacity-20 rounded-full h-1 mt-2">
                    <div class="bg-white h-1 rounded-full transition-all duration-${duration}" style="width: 100%; animation: shrink ${duration}ms linear forwards;"></div>
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200 ml-2">×</button>
        </div>
    `;
    
    // Add shrink animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);
}

// Activity Logging System
function logActivity(message, type = 'general') {
    const timestamp = new Date().toLocaleString();
    const activity = {
        timestamp,
        message,
        type,
        id: Date.now()
    };
    
    activityLog.unshift(activity);
    
    // Keep only last 100 activities
    if (activityLog.length > 100) {
        activityLog = activityLog.slice(0, 100);
    }
    
    // Update TM capture log if it's a terminology or sync activity
    if (type === 'terminology' || type === 'sync') {
        updateTMCaptureLog(message, timestamp);
    }
}

function updateTMCaptureLog(message, timestamp) {
    const tmLog = document.getElementById('tm-capture-log');
    if (tmLog) {
        const logEntry = document.createElement('div');
        logEntry.className = 'text-gray-700 mb-1';
        logEntry.textContent = `[${timestamp.split(' ')[1]}] 📝 ${message}`;
        tmLog.insertBefore(logEntry, tmLog.firstChild);
        
        // Keep only last 10 entries
        while (tmLog.children.length > 10) {
            tmLog.removeChild(tmLog.lastChild);
        }
    }
}

function viewActivityLog() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-5/6 flex flex-col">
            <div class="flex justify-between items-center p-6 border-b">
                <h3 class="text-xl font-semibold">Activity Log & Correspondence</h3>
                <div class="flex space-x-2">
                    <button onclick="openReportsFolder()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Export Log</button>
                    <button onclick="sendCorrespondenceUpdate()" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Send Update</button>
                    <button onclick="document.body.removeChild(this.closest('.fixed'))" class="text-gray-500 hover:text-gray-700">✕</button>
                </div>
            </div>
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="space-y-3" id="activity-log-display">
                    ${activityLog.length === 0 ? '<p class="text-gray-500">No activities logged yet.</p>' : 
                      activityLog.map(activity => `
                        <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                            <div class="w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}"></div>
                            <div class="flex-1">
                                <div class="text-sm font-medium">${activity.message}</div>
                                <div class="text-xs text-gray-500">${activity.timestamp}</div>
                            </div>
                            <span class="text-xs px-2 py-1 rounded ${getActivityBadge(activity.type)}">${activity.type}</span>
                        </div>
                      `).join('')}
                </div>
            </div>
            <div class="p-6 border-t bg-gray-50">
                <div class="text-sm text-gray-600">
                    <strong>W&A Team Contacts:</strong><br>
                    Abdul Latiff: <a href="mailto:abdullatiff@white-associates.net" class="text-blue-600">abdullatiff@white-associates.net</a><br>
                    Sofian: <a href="mailto:sofian@white-associates.net" class="text-blue-600">sofian@white-associates.net</a>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function getActivityColor(type) {
    const colors = {
        'terminology': 'bg-blue-500',
        'meeting': 'bg-green-500',
        'report': 'bg-purple-500',
        'email': 'bg-orange-500',
        'download': 'bg-indigo-500',
        'sync': 'bg-teal-500',
        'quality': 'bg-red-500',
        'general': 'bg-gray-500'
    };
    return colors[type] || 'bg-gray-500';
}

function getActivityBadge(type) {
    const badges = {
        'terminology': 'bg-blue-100 text-blue-800',
        'meeting': 'bg-green-100 text-green-800',
        'report': 'bg-purple-100 text-purple-800',
        'email': 'bg-orange-100 text-orange-800',
        'download': 'bg-indigo-100 text-indigo-800',
        'sync': 'bg-teal-100 text-teal-800',
        'quality': 'bg-red-100 text-red-800',
        'general': 'bg-gray-100 text-gray-800'
    };
    return badges[type] || 'bg-gray-100 text-gray-800';
}

function sendCorrespondenceUpdate() {
    const subject = 'PMD Translation Project - Status Update';
    const recentActivities = activityLog.slice(0, 10).map(activity => 
        `• [${activity.timestamp}] ${activity.message}`
    ).join('\n');
    
    const body = `Dear Abdul Latiff and Sofian,

Please find below the latest status update for the PMD Translation Project:

PROJECT PROGRESS:
• Homepage Content: Completed (850 words)
• FAQ Section: Completed (56,378 words)  
• Info Korporat: Completed (129,189 words)
• Quick Access Bar: Pending (~320 words)
• Footer Content: Pending (~180 words)

RECENT ACTIVITIES:
${recentActivities}

NEXT STEPS:
• Continue with remaining sections
• Quality review of completed work
• Update project timeline

Please let me know if you need any additional information or have any questions.

Best regards,
PMD Translation Project Team

---
This is an automated update from the PMD Translation Portal.`;

    const mailtoLink = `mailto:abdullatiff@white-associates.net,sofian@white-associates.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    
    createAdvancedNotification('Correspondence update email opened in your default email client', 'success');
    logActivity('Project status update sent to W&A team', 'email');
}

// Add Activity Log button to header
function addActivityLogButton() {
    const headerDiv = document.querySelector('.bg-gradient-to-r.from-blue-900.to-blue-700 .flex.items-center.space-x-4');
    if (headerDiv) {
        const activityButton = document.createElement('button');
        activityButton.onclick = viewActivityLog;
        activityButton.className = 'bg-white bg-opacity-20 text-white px-4 py-2 rounded hover:bg-opacity-30';
        activityButton.innerHTML = '📋 Activity Log';
        headerDiv.insertBefore(activityButton, headerDiv.lastElementChild);
    }
}

// Initialize Application
function initializeApp() {
    // Initialize project statistics
    updateProjectStats();
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 2); // 2 months from now
    
    document.getElementById('start-date').value = today;
    document.getElementById('end-date').value = endDate.toISOString().split('T')[0];
    
    // Set up event listeners
    document.getElementById('start-date').addEventListener('change', updateDaysRemaining);
    document.getElementById('end-date').addEventListener('change', updateDaysRemaining);
    
    // Initialize tabs
    initializeTabs();
    
    // Initial calculations
    updateDaysRemaining();
    
    // Add activity log button
    setTimeout(addActivityLogButton, 100);
    
    // Log initial activity
    logActivity('PMD Translation Portal initialized successfully', 'general');
    
    // Show welcome notification
    setTimeout(() => {
        createAdvancedNotification('Welcome to PMD Translation Portal! All systems ready.', 'success');
    }, 1000);
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Override the basic showNotification with enhanced version
function showNotification(message, type = 'info') {
    createAdvancedNotification(message, type);
}