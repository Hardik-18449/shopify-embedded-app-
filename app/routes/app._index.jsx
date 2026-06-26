import { useState } from "react";
import { useFetcher } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};
export const action = async ({ request }) => {
  const formData = await request.formData();

  const announcement = formData.get("announcement");

  return {
    success: true,
    announcement,
  };
};

export default function Index() {
  const fetcher = useFetcher();
  const [announcement, setAnnouncement] = useState("");

  const isLoading =
    fetcher.state === "loading" || fetcher.state === "submitting";

  return (
    <s-page heading="Announcement Dashboard">
      <s-section heading="Create Announcement">
        <s-text-field
          label="Announcement"
          placeholder="Type announcement here..."
          value={announcement}
          onInput={(e) => setAnnouncement(e.target.value)}
        />

        <div style={{ marginTop: "12px" }}>
          <s-text>
            Characters: {announcement.length}/500
          </s-text>
        </div>

        <div style={{ marginTop: "20px" }}>
          <s-button
            variant="primary"
            loading={isLoading}
            disabled={!announcement.trim()}
            onClick={() =>
              fetcher.submit(
                { announcement },
                { method: "POST" }
              )
            }
          >
            Save Announcement
          </s-button>
        </div>

        {fetcher.data?.success && (
          <div style={{ marginTop: "20px" }}>
            <s-banner tone="success">
              Announcement saved successfully!
            </s-banner>
          </div>
        )}
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
