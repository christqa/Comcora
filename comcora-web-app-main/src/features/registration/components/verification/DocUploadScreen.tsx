import { useEffect, useState, type FC } from "react";
import SumsubWebSdk from "@sumsub/websdk-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

type DocUploadScreenProps = {
  nextStep: () => void;
};

export const DocUploadScreen: FC<DocUploadScreenProps> = ({ nextStep }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const [userVerified, setUserVerified] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");

  const generateUniqueId = () => crypto.randomUUID();

  useEffect(() => {
    setUserId(generateUniqueId());

    const fetchAccessToken = async () => {
      try {
        const response = await fetch("/api/sumsub/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: generateUniqueId(),
            levelName: "basic-kyc-level",
          }),
        });

        const data = await response.json();
        if (data.token) {
          console.log("Access Token:", data.token);
          setAccessToken(data.token);
        } else {
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch access token:", error);
      }
    };

    fetchAccessToken().catch((error) => console.log(error));
  }, []);

  const handleSumsubMessage = (type: string, payload?: any) => {
    console.log("Sumsub Web SDK Event:", type, payload);

    if (type === "idCheck.onApplicantStatusChanged" && payload?.reviewResult) {
      if (payload.reviewResult.reviewAnswer === "GREEN") {
        setUserVerified(true);
      }
    }

    if (type === "idCheck.onStepCompleted") {
      console.log(`Step completed: ${payload?.step}`);
    }

    if (type === "idCheck.onError") {
      console.error("Verification error:", payload?.error?.message);
    }
  };

  return (
    <div className={"flex h-full flex-col gap-10"}>
      <div className={"flex flex-col items-center gap-4"}>
        <div className="max-h-[800px] w-[600px] overflow-scroll rounded-xl bg-fill-primary p-4">
          {accessToken && (
            <>
              <SumsubWebSdk
                accessToken={accessToken}
                onMessage={handleSumsubMessage}
                expirationHandler={() =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve("fake-access-token-123456");
                    }, 500);
                  })
                }
                config={{
                  lang: language,
                  country: "EE",
                  i18n: {
                    locale: "en",
                    customTranslations: {
                      en: {
                        "auth.registration.docUploadHint": "",
                        "auth.registration.selectDocType":
                          "Choose your document",
                        "auth.registration.issuingCountry": "Country of issue",
                        "auth.registration.continue": "Proceed",
                        "auth.registration.continueOnPhone":
                          "Continue on mobile",
                      },
                    },
                  },
                }}
              />

              {userVerified && (
                <Button
                  size={"L"}
                  disabled={!userVerified}
                  onClick={nextStep}
                  className="mt-24 w-full"
                  variant={"accent"}
                >
                  Continue
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
