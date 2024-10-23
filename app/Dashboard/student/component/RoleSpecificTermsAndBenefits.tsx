import React from "react";

type Role = "student" | "hostelOwner";

interface RoleContent {
  terms: string[];
  benefits: string[];
}

interface RoleContentMap {
  [key: string]: RoleContent;
}

interface RoleSpecificTermsAndBenefitsProps {
  getCurrentRoleName: () => Role;
}

const RoleSpecificTermsAndBenefits: React.FC<
  RoleSpecificTermsAndBenefitsProps
> = ({ getCurrentRoleName }) => {
  const currentRole: Role = getCurrentRoleName();

  const roleContent: RoleContentMap = {
    student: {
      terms: [
        "Maintain a clean and tidy living space",
        "Respect quiet hours from 10 PM to 7 AM",
        "No illegal substances or activities on the premises",
        "Notify management of any maintenance issues promptly",
        "Adhere to all safety protocols and emergency procedures",
      ],
      benefits: [
        "Access to study areas and common rooms",
        "High-speed internet connection",
        "Organized social events and activities",
        "Discounted rates for long-term stays",
        "24/7 security and support",
      ],
    },
  };

  const roleName: string =
    currentRole.charAt(0).toUpperCase() + currentRole.slice(1);

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-center text-indigo-700">
        Benefits for Student
      </h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="space-y-6">
              {roleContent[currentRole] && (
                <>
                  <h4 className="font-medium text-indigo-600">
                    Exclusive benefits for students:
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                    {roleContent[currentRole].benefits.map(
                      (benefit: string, index: number) => (
                        <li key={index}>{benefit}</li>
                      )
                    )}
                  </ul>
                </>
              )}
              <div className="space-y-4">
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-indigo-600">
                    You are registering as a:
                  </p>
                  <p className="text-lg font-bold text-indigo-700">student</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6"></div>
        </div> */}
      </div>
    </div>
  );
};

export default RoleSpecificTermsAndBenefits;
