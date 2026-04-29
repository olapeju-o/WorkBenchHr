/* Create-document browse template catalog (data for static-site only). */
(function () {
  "use strict";

  window.WB_CREATE_DOC_TEMPLATE_SECTIONS = {
    company: [
      {
        sectionTitle: "Offers & agreements",
        files: [
          { name: "Standard_Full_Time_Offer_Letter_US.pdf", pageCount: 4 },
          { name: "Executive_Compensation_Offer_Summary.pdf", pageCount: 6 },
          { name: "Independent_Contractor_Master_Services_Agreement.pdf", pageCount: 12 },
          { name: "Intern_Offer_Letter_Summer_2026.pdf", pageCount: 3 },
        ],
      },
      {
        sectionTitle: "NDAs & confidentiality",
        files: [
          { name: "Mutual_Nondisclosure_Agreement_2026.pdf", pageCount: 8 },
          { name: "Employee_Confidentiality_and_IP_Assignment.pdf", pageCount: 5 },
          { name: "Visitor_NDA_Short_Form.pdf", pageCount: 2 },
        ],
      },
      {
        sectionTitle: "Policies & acknowledgments",
        files: [
          { name: "Remote_Work_Policy_Addendum.pdf", pageCount: 4 },
          { name: "Code_of_Conduct_Acknowledgment.pdf", pageCount: 3 },
          { name: "Equipment_Use_Agreement.pdf", pageCount: 2 },
        ],
      },
    ],
    performance: [
      {
        sectionTitle: "Reviews & cycles",
        files: [
          { name: "Annual_Performance_Review_Manager_Worksheet.pdf", pageCount: 7 },
          { name: "Mid_Year_Check_In_Template.pdf", pageCount: 4 },
          { name: "Probationary_Review_30_60_90.pdf", pageCount: 5 },
        ],
      },
      {
        sectionTitle: "Goals & KPIs",
        files: [
          { name: "OKR_Planning_Sheet_Q2.pdf", pageCount: 6 },
          { name: "SMART_Goals_Worksheet_Role_Based.pdf", pageCount: 3 },
          { name: "Sales_Quota_Attainment_Summary.pdf", pageCount: 4 },
        ],
      },
      {
        sectionTitle: "Feedback & calibration",
        files: [
          { name: "360_Feedback_Request_Email_Pack.pdf", pageCount: 9 },
          { name: "Calibration_Notes_Manager_Guide.pdf", pageCount: 6 },
          { name: "Peer_Feedback_Form.pdf", pageCount: 2 },
        ],
      },
    ],
    payroll: [
      {
        sectionTitle: "Compensation structure",
        files: [
          { name: "Salary_Bands_by_Level_2026.pdf", pageCount: 14 },
          { name: "Bonus_Eligibility_Matrix.pdf", pageCount: 5 },
          { name: "Overtime_and_Rounding_Policy_CA.pdf", pageCount: 10 },
        ],
      },
      {
        sectionTitle: "Benefits & leave",
        files: [
          { name: "Open_Enrollment_Summary_One_Pager.pdf", pageCount: 2 },
          { name: "HSA_and_FSA_Eligibility_Notice.pdf", pageCount: 4 },
          { name: "Parental_Leave_Overview.pdf", pageCount: 6 },
        ],
      },
      {
        sectionTitle: "Payroll operations",
        files: [
          { name: "Direct_Deposit_Authorization_Form.pdf", pageCount: 2 },
          { name: "Payroll_Correction_Request.pdf", pageCount: 3 },
          { name: "Garnishment_Notice_Response_Checklist.pdf", pageCount: 4 },
        ],
      },
    ],
    legal: [
      {
        sectionTitle: "Handbook & policies",
        files: [
          { name: "Employee_Handbook_Master_2026.pdf", pageCount: 48 },
          { name: "State_Labor_Law_Addendum_California.pdf", pageCount: 18 },
          { name: "Social_Media_and_Device_Policy.pdf", pageCount: 6 },
        ],
      },
      {
        sectionTitle: "Compliance programs",
        files: [
          { name: "Anti_Harassment_and_Retaliation_Policy.pdf", pageCount: 11 },
          { name: "Whistleblower_Reporting_Procedures.pdf", pageCount: 7 },
          { name: "Records_Retention_Schedule_HR.pdf", pageCount: 9 },
        ],
      },
      {
        sectionTitle: "Privacy & data",
        files: [
          { name: "Employee_Privacy_Notice_US.pdf", pageCount: 5 },
          { name: "Background_Check_Consent_Form.pdf", pageCount: 3 },
          { name: "Vendor_DPA_HR_Systems_Checklist.pdf", pageCount: 8 },
        ],
      },
    ],
    hiring: [
      {
        sectionTitle: "Job postings & descriptions",
        files: [
          { name: "Job_Posting_Customer_Success_Manager.pdf", pageCount: 3 },
          { name: "Barista_Role_Description_Final.pdf", pageCount: 2 },
          { name: "Senior_PM_Job_Description_Engineering.pdf", pageCount: 4 },
        ],
      },
      {
        sectionTitle: "Interview & assessment",
        files: [
          { name: "Structured_Interview_Scorecard_Template.pdf", pageCount: 4 },
          { name: "Panel_Interview_Guide_Hiring_Manager.pdf", pageCount: 8 },
          { name: "Take_Home_Assignment_Data_Analyst.pdf", pageCount: 5 },
        ],
      },
      {
        sectionTitle: "Offers & pre-boarding",
        files: [
          { name: "Contingent_Offer_Checklist.pdf", pageCount: 2 },
          { name: "Pre_Boarding_Document_Request_List.pdf", pageCount: 3 },
          { name: "Reference_Check_Summary_Form.pdf", pageCount: 2 },
        ],
      },
    ],
    employment: [
      {
        sectionTitle: "Promotions & transfers",
        files: [
          { name: "Internal_Promotion_Notification_Letter.pdf", pageCount: 2 },
          { name: "Transfer_Checklist_Department_to_Department.pdf", pageCount: 4 },
          { name: "Comp_Change_Notice_Template.pdf", pageCount: 3 },
        ],
      },
      {
        sectionTitle: "Discipline & performance improvement",
        files: [
          { name: "Written_Warning_Template.pdf", pageCount: 3 },
          { name: "PIP_Plan_30_Day.pdf", pageCount: 6 },
          { name: "Final_Warning_Meeting_Agenda.pdf", pageCount: 2 },
        ],
      },
      {
        sectionTitle: "Separations & offboarding",
        files: [
          { name: "Voluntary_Resignation_Acceptance_Letter.pdf", pageCount: 2 },
          { name: "RIF_Notification_Script_Manager.pdf", pageCount: 5 },
          { name: "COBRA_Election_Notice_Package.pdf", pageCount: 7 },
        ],
      },
    ],
  };

  var flat = {};
  Object.keys(window.WB_CREATE_DOC_TEMPLATE_SECTIONS).forEach(function (cat) {
    window.WB_CREATE_DOC_TEMPLATE_SECTIONS[cat].forEach(function (sec) {
      sec.files.forEach(function (f) {
        flat[f.name] = f.pageCount;
      });
    });
  });
  window.WB_FILE_PAGE_COUNT = flat;
})();
