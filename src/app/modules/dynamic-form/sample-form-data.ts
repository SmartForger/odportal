import { DynamicForm } from 'src/app/models/dynamic-form';

export const sampleForm: DynamicForm = {
  docId: 'sample',
  type: 'form',
  title: 'string',
  createdAt: new Date(),
  layout: {
    rows: [
      {
        columns: [
          {
            field: {
              type: 'description',
              attributes: {
                description:
                  '<h2> System Authorization Access Request(SAAR) </h2> <h3> PRIVACY ACT STATEMENT </h3> <p> <strong> AUTHORITY: </strong> <br> Executive Order 10450, 9397;and Public Law 99 - 474, the Computer Fraud and Abuse Act. </p> <p> <strong> PRINCIPAL PURPOSE: </strong> <br> To record names, signatures, and other identifiers for the purpose of validating the trustworthiness of individuals requesting access to Department of Defense(DoD) systems and information.NOTE: Records may be maintained in both electronic and / or paper form. </p> <p> <strong> ROUTINE USES: </strong> <br> None. </p> <p> <strong> DISCLOSURE: </strong> <br> Disclosure of this information is voluntary; however, failure to provide the requested information may impede, delay or prevent further processing of this request. </p>'
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'radio',
              label: 'Type of Request',
              binding: 'requestType',
              attributes: {
                required: true,
                default: 1,
                options: [
                  {
                    display: 'Initial',
                    value: 'initial'
                  },
                  {
                    display: 'Modification',
                    value: 'modification'
                  },
                  {
                    display: 'Deactivate',
                    value: 'deactivate'
                  },
                  {
                    display: 'User ID',
                    value: 'userID'
                  }
                ]
              }
            }
          },
          {
            field: {
              type: 'text',
              label: 'User ID (If Selected)',
              binding: 'userID',
              attributes: {
                required: false,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: 'Date  (YYYY/MM/DD)',
              binding: 'date',
              preserveBinding: true,
              attributes: {
                required: false,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: 'System Name (Platform or Applications)',
              binding: 'systemName',
              attributes: {
                required: true,
                maxlength: 256
              },
              autofill: {
                type: 'static',
                value: 'Persistent Cyber Training Environment (PCTE)'
              }
            }
          },
          {
            field: {
              type: 'text',
              label: 'Location (Physical Location)',
              binding: 'physicalLocation',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'description',
              attributes: {
                description:
                  '<h3> Part 1 </h3> <i> To be completed by Requestor. </i>'
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: '1. Name (Last Name, First Name, MI)',
              binding: 'name',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: '2. Organization',
              binding: 'organization',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: '3. Office Symbol / Department',
              binding: 'officeSymbolDepartment',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: '4. Phone (DSN or Commercial)',
              binding: 'phoneDSN',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: '5. Official E-mail Address',
              binding: 'email',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: '6. Job Title & Grade / Rank',
              binding: 'jobTitle',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: '7. Official Mailing Address',
              binding: 'address',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'radio',
              label: '8. Citizenship',
              binding: 'citizenship',
              attributes: {
                required: true,
                default: 1,
                options: [
                  {
                    display: 'US',
                    value: 'us'
                  },
                  {
                    display: 'FN',
                    value: 'fn'
                  },
                  {
                    display: 'Other',
                    value: 'other'
                  }
                ]
              }
            }
          },
          {
            field: {
              type: 'radio',
              label: '9. Designation of Person',
              binding: 'designation',
              attributes: {
                required: true,
                default: 1,
                options: [
                  {
                    display: 'Military',
                    value: 'military'
                  },
                  {
                    display: 'Contractor',
                    value: 'contractor'
                  },
                  {
                    display: 'Civilian',
                    value: 'civilian'
                  }
                ]
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'radio',
              label:
                '10. IA Training & Awareness Certification Requirements (Complete as required for user or functional level access) ',
              binding: 'requestType',
              attributes: {
                required: true,
                default: 1,
                options: [
                  {
                    display:
                      'I have completed Annual Information Awareness Training.',
                    value: 'iaCompletion'
                  }
                ]
              }
            }
          },
          {
            field: {
              type: 'text',
              label:
                'IA Training & Awareness Certification Completion Date  (YYYY/MM/DD)',
              binding: 'iaCompletionDate',
              preserveBinding: true,
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'signature',
              label: '11. Signature',
              binding: 'signature',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: '12. Date (YYYY/MM/DD)',
              binding: 'date',
              preserveBinding: true,
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'description',
              attributes: {
                description:
                  '<h3> Part 2 </h3> - <i>Endorsement of Access by Information Owner, User Supervisor or Government Sponsor.If individual is a contractor - provide company name, contract number, and date of contract expiration in Block 16. < /i>'
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'radio',
              label: '13. JUSTIFICATION FOR ACCESS - Do you have a CAC?',
              binding: 'cac',
              attributes: {
                required: true,
                options: [
                  {
                    display: 'Yes',
                    value: 'yes'
                  },
                  {
                    display: 'No',
                    value: 'no'
                  }
                ]
              }
            }
          },
          {
            field: {
              type: 'text',
              label: '13a. If yes, provide your EDIPI Number:',
              binding: 'edipiNumber',
              attributes: {
                required: false,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'description',
              attributes: {
                description:
                  '<h5>Location</h5> <strong> Infrastructure Team </strong>: <p>RCS DEV</p> <br> <strong> Cyber Security Team </strong>: <p>Distributed</p> <br> <strong> PCTE OPS Team </strong>: <p>Distributed</p> <br>'
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'radio',
              label:
                '14. Type of Access Required (If you have a Privileged user that also needs a User Account, the Employee should check both the Authorized and Privileged blocks.)',
              binding: 'accessType',
              attributes: {
                required: true,
                default: 2,
                options: [
                  {
                    display: 'Authorized',
                    value: 'authorized'
                  },
                  {
                    display: 'Privileged',
                    value: 'privileged'
                  }
                ]
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'radio',
              label: '15. User Requires Access to',
              binding: 'accessRequired',
              attributes: {
                required: true,
                default: 1,
                options: [
                  {
                    display: 'Unclassified',
                    value: 'unclassified'
                  },
                  {
                    display: 'Classified',
                    value: 'classified'
                  },
                  {
                    display: 'Other',
                    value: 'other'
                  }
                ]
              }
            }
          },
          {
            field: {
              type: 'text',
              label: 'If Classified, specify the category.',
              binding: 'classifiedCategory',
              attributes: {
                required: false,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: "If 'Other' was selected, specify the category.",
              binding: 'otherSpecify',
              attributes: {
                required: false,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'checkbox',
              label: '16. Verification of Need to Know',
              binding: 'needToKnow',
              attributes: {
                required: true,
                display:
                  'I certify that this user requires access as requested.',
                value: 'certifyAccess'
              }
            }
          },
          {
            field: {
              type: 'textarea',
              label:
                '16a. Access Expiration Date  (YYYY/MM/DD), Company Name, Contract Number ',
              binding: 'expirationDateCompanyNameContractNumber',
              attributes: {
                required: true,
                maxlength: 3500
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: "17. Supervisor's Name",
              binding: 'supervisorName',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'signature',
              label: "18. Supervisor's Signature",
              binding: 'supervisorSignature',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: '19. Date (YYYY/MM/DD)',
              binding: 'supervisorSignatureDate',
              preserveBinding: true,
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: "20. Supervisor's Organization / Department",
              binding: 'supervisorOrganization',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: "20a. Supervisor's Email Address",
              binding: 'supervisorEmail',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: "20b. Supervisor's Phone Number",
              binding: 'supervisorPhone',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'signature',
              label: "21. Information Owner / OPR's Signature",
              binding: 'informationOwnerSignature',
              attributes: {
                required: true,
                maxlength: 256,
                minlength: 2
              }
            }
          },
          {
            field: {
              type: 'text',
              label: "21a. Information Owner / OPR's Phone Number",
              binding: 'informationOwnerPhone',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: '21b. Date (YYYY/MM/DD)',
              binding: 'informationOwnerSignatureDate',
              preserveBinding: true,
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'signature',
              label: "22. IAO or Appointee's Signature",
              binding: 'iaoSignature',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: "23. IAO or Appointee's Organization / Department",
              binding: 'iaoOrganization',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: "24. IAO or Appointee's Phone Number",
              binding: 'iaoPhone',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: '25. Date (YYYY/MM/DD)',
              binding: 'iaoSignatureDate',
              preserveBinding: true,
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: '26. Name (Last, First, Middle Initial)',
              binding: 'name',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'textarea',
              label: '27. Optional Information (Additional Information)',
              binding: 'optionalInformation',
              attributes: {
                required: false,
                maxlength: 3500
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'description',
              attributes: {
                description:
                  ' <h3> Part 3 </h3> <i> Security Manager Validates the Backend Investigation or Clearance Information. </i>'
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: '28. Type of Investigation',
              binding: 'investigationType',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: '28a. Date of Investigation (YYYY/MM/DD)',
              binding: 'investigationDate',
              preserveBinding: true,
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: '28b. Clearance Level',
              binding: 'clearanceLevel',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'radio',
              label: '28c. IT Level Designation',
              binding: 'levelDesignation',
              attributes: {
                required: true,
                default: 1,
                options: [
                  {
                    display: 'Level 1',
                    value: 'levelI'
                  },
                  {
                    display: 'Level 2',
                    value: 'levelII'
                  },
                  {
                    display: 'Level 3',
                    value: 'levelIII'
                  }
                ]
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: '29. Verified By (Name)',
              binding: 'verifiedBy',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: '30. Security Manager Phone Number',
              binding: 'securityManagerPhone',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'signature',
              label: "31. Security Manager's Signature",
              binding: 'securityManagerSignature',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: '32. Date (YYYY/MM/DD)',
              binding: 'securityManagerSignatureDate',
              preserveBinding: true,
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'description',
              attributes: {
                description:
                  '<h3> Part 4 </h3> <i> Completion by Authorized Staff Preparing Account Information. </i>'
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: 'System Title',
              binding: 'systemTitle',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: 'Domain Title',
              binding: 'domainTitle',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: 'Server Title',
              binding: 'serverTitle',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: 'Application Title',
              binding: 'applicationTitle',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: 'Directories Title',
              binding: 'directoriesTitle',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: 'Files Title',
              binding: 'filesTitle',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: 'Datasets Title',
              binding: 'datasetsTitle',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: 'System Account Code',
              binding: 'systemAcountCode',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: 'Date Processed (YYYY/MM/DD)',
              binding: 'dateProcessed',
              preserveBinding: true,
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: 'Processed By (Print Name)',
              binding: 'processedBy',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'signature',
              label: "Processed By's Signature",
              binding: 'processedBySignature',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: 'Date (YYYY/MM/DD)',
              binding: 'processedBySignatureDate',
              preserveBinding: true,
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'text',
              label: 'Date Revalidated (YYYY/MM/DD)',
              binding: 'dateRevalidated',
              preserveBinding: true,
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: 'Revalidated By (Print name and sign)',
              binding: 'revalidatedBy',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'signature',
              label: "Revalidated By's Signature",
              binding: 'revalidatedBySignature',
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          },
          {
            field: {
              type: 'text',
              label: 'Date (YYYY/MM/DD)',
              binding: 'revalidatedBySignatureDate',
              preserveBinding: true,
              attributes: {
                required: true,
                maxlength: 256
              }
            }
          }
        ]
      },
      {
        columns: [
          {
            field: {
              type: 'description',
              attributes: {
                description:
                  "<h2> Instructions </h2> <h3> The prescribing document is as issued by using DoD Component. </h3> <h5> A.PART I: </h5> <p> The following information is provided by the user when establishing or modifying their USER ID. </p> <p style = 'padding-left: 30px;'> (1) Name.The last name, first name, and middle initial of the user. <br> (2) Organization.The user’ s current organization(i.e.DISA, SDI, DoD and government agency or commercial firm). < br > (3) Office Symbol / Department.The office symbol within the current organization(i.e.SDI). <br> (4) Telephone Number / DSN.The Defense Switching Network(DSN) phone number of the user.If DSN is unavailable, indicate commercial number. <br> (5) Official E - mail Address.The user’ s official e - mail address. <br>(6) Job Title / Grade / Rank.The civilian job title(Example: Systems Analyst, GS - 14, Pay Clerk, GS - 5) / military rank(COL, United States Army, CMSgt, USAF) or“ CONT” if user is a contractor. <br> (7) Official Mailing Address.The user’ s official mailing address. <br> (8) Citizenship(US, Foreign National, or Other). <br> (9) Designation of Person(Military, Civilian, Contractor). <br>(10) IA Training and Awareness Certification Requirements.User must indicate if he / she has completed the Annual Information Awareness Training and the date. <br> (11) User’ s Signature.User must sign the DD Form 2875 with the understanding that they are responsible and accountable for their password and access to the system(s). <br> (12) Date.The date that the user signs the form. </p> <h5 > B.PART II: </h5> <p> The information below requires the endorsement from the user’ s Supervisor or the Government Sponsor. </p> <p style = 'padding-left: 30px;'> (13).Justification for Access.A brief statement is required to justify establishment of an initial USER ID.Provide appropriate information if the USER ID or access to the current USER ID is modified. < br > (14) Type of Access Required: Place an“ X” in the appropriate box.(Authorized– Individual with normal access.Privileged– Those with privilege to amend or change system configuration, parameters, or settings.) <br> (15) User Requires Access To: Place an“ X” in the appropriate box.Specify category. <br>(16) Verification of Need to Know.To verify that the user requires access as requested. <br> (16 a) Expiration Date for Access.The user must specify expiration date if less than 1 year. <br> (17) Supervisor’ s Name(Print Name).The supervisor or representative prints his / her name to indicate that the above information has been verified and that access is required. <br>(18) Supervisor’ s Signature.Supervisor’ s signature is required by the endorser or his / her representative. <br>(19) Date.Date supervisor signs the form. <br>(20) Supervisor’ s Organization / Department.Supervisor’ s organization and department. <br>(20 a) E - mail Address.Supervisor’ s e - mail address.(20 b) Phone Number.Supervisor’ s telephone number. <br>(21) Signature of Information Owner / OPR.Signature of the functional appointee responsible for approving access to the system being requested. < br >(21 a) Phone Number.Functional appointee telephone number. <br>(21 b) Date.The date the functional appointee signs the DD Form 2875. <br>(22) Signature of Information Assurance Officer(IAO) or Appointee.Signature of the IAO or Appointee of the office responsible for approving access to the system being requested. <br>(23) Organization / Department.IAO’ s organization and department. <br>(24) Phone Number.IAO’ s telephone number. <br>(25) Date.The date IAO signs the DD Form 2875. <br>(27) Optional Information.This item is intended to add additional information, as required. </p><h5> C.PART III: </h5> <p> Certification of Background Investigation or Clearance. < /p> <p style = 'padding-left: 30px;'> (28) Type of Investigation.The user’ s last type of background <br> investigation(i.e., NAC, NACI, or SSBI). <br>(28 a) Date of Investigation.Date of last investigation. <br>(28 b) Clearance Level.The user’ s current security clearance level(Secret or Top Secret). <br>(28 c) IT Level Designation.The user’ s IT designation(Level I, Level II, or Level III). <br>(29) Verified By.The Security Manager or representative prints his / her name to indicate that the above clearance and investigation information has been verified. <br>(30) Security Manager Telephone Number.The telephone number of the Security Manager or his / her representative. <br>(31) Security Manager Signature.The Security Manager or his / her representative indicates that the above clearance and investigation information has been verified. <br>(32) Date.The date that the form was signed by the Security Manager or his / her representative. </p> <h5> D.PART IV: < /h5> <p> This information is site specific and can be customized by either the DoD, functional activity, or the customer with approval of the DoD.This information will specifically identify the access required by the user. </p> <h5> E.DISPOSITION OF FORM: </h5> <p> TRANSMISSION: Form may be electronically transmitted, faxed, or mailed.Adding a password to this form makes it a minimum of “FOR OFFICIAL USE ONLY” and must be protected as such. </p> <p> FILING: Original SAAR, with original signatures in Parts I, II, and III, must be maintained on file for one year after termination of user’ s account.File may be maintained by the DoD or by the Customer’ s IAO.Recommend file be maintained by IAO adding the user to the system. </p>"
              }
            }
          }
        ]
      }
    ]
  }
};
