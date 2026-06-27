import { useState, useEffect } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { connectDB } from "../config/mongodb.server";
import Announcement from "../models/announcement.model";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  await connectDB();
  const announcementDoc = await Announcement.findOne()
    .sort({ createdAt: -1 })
    .lean();

  return {
    announcementText: announcementDoc ? announcementDoc.announcement : "",
  };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  await connectDB();

  const formData = await request.formData();
  const text = formData.get("announcement");

  if (!text || !text.trim()) {
    return {
      success: false,
      message: "Announcement is required.",
    };
  }

  try {
    const newDoc = await Announcement.create({
      announcement: text.trim(),
    });
    const response = await admin.graphql(
      `#graphql
      mutation CreateMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            value
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          metafields: [
            {
              namespace: "my_app",
              key: "announcement",
              type: "single_line_text_field",
              value: text.trim(),
            },
          ],
        },
      }
    );

    const responseJson = await response.json();
    const userErrors = responseJson.data?.metafieldsSet?.userErrors;

    if (userErrors && userErrors.length > 0) {
      return {
        success: false,
        message: `Saved to DB, but failed to sync to Shopify: ${userErrors[0].message}`,
      };
    }

    return {
      success: true,
      message: "Announcement updated successfully.",
      announcementText: newDoc.announcement,
    };

  } catch (error) {
    return {
      success: false,
      message: "An error occurred while saving.",
    };
  }
};

export default function Index() {
  const { announcementText: initialText } = useLoaderData();
  const fetcher = useFetcher();

  const [announcementText, setAnnouncement] = useState(initialText || "");

  useEffect(() => {
    if (initialText !== undefined) {
      setAnnouncement(initialText);
    }
  }, [initialText]);

  useEffect(() => {
    if (fetcher.data?.success && fetcher.data?.announcementText !== undefined) {
      setAnnouncement(fetcher.data.announcementText);
    }
  }, [fetcher.data]);

  const isLoading = fetcher.state === "loading" || fetcher.state === "submitting";

  return (
    <s-page heading="Announcement Dashboard">
      <s-section heading="Create Announcement">
        <s-text-field
          label="Announcement Text"
          placeholder="Type announcement here..."
          value={announcementText}
          maxlength="500"
          onInput={(e) => setAnnouncement(e.target.value)}
        />

        <div style={{ marginTop: "12px" }}>
          <s-text>
            Characters: {announcementText.length}/500
          </s-text>
        </div>

        <div style={{ marginTop: "20px" }}>
          <s-button
            variant="primary"
            loading={isLoading}
            disabled={!announcementText.trim()}
            onClick={() =>
              fetcher.submit(
                { announcement: announcementText },
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
              {fetcher.data.message}
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