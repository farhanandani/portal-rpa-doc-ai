import DOMPurify from "dompurify";
import * as XLSX from "xlsx";
import Papa from "papaparse";

import moment from "moment";

export const isValidUrlMinio = (url: string): boolean => {
  const validDomain = "https://minio-aihub-dev.libra.studio";

  try {
    const parsedUrl = new URL(url); // Ensures the URL is valid
    return parsedUrl.origin === validDomain; // Compares the origin with the valid domain
  } catch {
    return false; // Invalid URL format
  }
};

export const isValidUrlGCS = (url: string): boolean => {
  const validDomain = "https://storage.googleapis.com";

  try {
    const parsedUrl = new URL(url); // Ensures the URL is valid
    return parsedUrl.origin === validDomain; // Compares the origin with the valid domain
  } catch {
    return false; // Invalid URL format
  }
};

export const detectAndParseObject = (input: string) => {
  if (typeof input !== "string") {
    return false;
  }

  try {
    const parsed = JSON.parse(input);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      return parsed;
    }
    return false;
  } catch (error) {
    return false;
  }
};
export const formatRelativeTime = (seconds: number) => {
  if (seconds < 60) {
    return "Just Now";
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} Minute${minutes > 1 ? "s" : ""} Ago`;
  } else if (seconds < 86400) {
    // 86400 seconds in a day
    const hours = Math.floor(seconds / 3600);
    return `${hours} Hour${hours > 1 ? "s" : ""} Ago`;
  } else {
    const days = Math.floor(seconds / 86400);
    return `${days} Day${days > 1 ? "s" : ""} Ago`;
  }
};

export const formatNumberToTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // Pad with leading zeros if necessary
  const formattedTime = [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(secs).padStart(2, "0"),
  ].join(":");

  return formattedTime;
};

export const getFilenameFromUrl = (url: string): string => {
  const segments = url.split("/");
  return segments.pop() || ""; // Gets the last segment of the URL
};

export const getFileNameFromUrlGCS = (url: string): string => {
  const gcsBucket = import.meta.env.VITE_GCS_BUCKET_NAME;
  const result = url.split(`${gcsBucket}/`)[1];
  return result;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "active": {
      return "green";
    }
    case "inactive": {
      return "red";
    }
    case "suspend": {
      return "magenta";
    }

    default: {
      return "";
    }
  }
};

export const formatTimeStamp = (timestamp: string): string => {
  // Create a Date object from the UTC timestamp
  const utcDate = new Date(timestamp);

  const jakartaTime = new Date(utcDate.getTime() + 60 * 1000);

  // Extract and format the date and time components
  const day = String(jakartaTime.getUTCDate()).padStart(2, "0");
  const month = String(jakartaTime.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = jakartaTime.getUTCFullYear();
  const hours = String(jakartaTime.getUTCHours()).padStart(2, "0");
  const minutes = String(jakartaTime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(jakartaTime.getUTCSeconds()).padStart(2, "0");

  // Combine into the desired format
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const formatPhoneNumberwithminus = (phoneNumber: string) => {
  // Remove the hyphen
  const formattedNumber = phoneNumber.replace("-", "");

  // Return the formatted phone number
  return formattedNumber;
};

export const scrollToId = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export const convertSecondsToHHMMSS = (totalSeconds: number) => {
  // Create a moment duration object from total seconds
  const duration = moment.duration(totalSeconds, "seconds");

  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const remainingSeconds = duration.seconds();

  return `${days} days - ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const exportXLSX = ({
  dataTable,
  type,
}: {
  dataTable: any;
  type: string;
}) => {
  if (dataTable.length !== 0) {
    const newData = dataTable.map((obj: any) => {
      const newObj = { ...obj }; // Create a shallow copy of the object
      delete newObj.file; // Remove the "file" property
      return newObj;
    });
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert data and headers to worksheet
    const worksheet = XLSX.utils.json_to_sheet([...newData]);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Generate XLSX file and trigger download
    XLSX.writeFile(
      workbook,
      `${type}-ekyc-dana-agent-${moment().format("DDMMYYhhmmss")}.xlsx`,
    );
  }
};

export const exportCSV = ({
  dataTable,
  type,
}: {
  dataTable: any;
  type: string;
}) => {
  if (dataTable.length !== 0) {
    const newData = dataTable.map((obj: any) => {
      const newObj = { ...obj }; // Create a shallow copy of the object
      delete newObj.file; // Remove the "file" property
      return newObj;
    });
    // Convert data to CSV
    const csv = Papa.unparse(newData);

    // Download CSV file
    const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const csvUrl = URL.createObjectURL(csvBlob);
    const link = document.createElement("a");
    link.href = csvUrl;
    link.setAttribute(
      "download",
      `${type}-ekyc-dana-agent-${moment().format("DDMMYYhhmmss")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
  }
};

export const months = (config: any) => {
  const cfg = config || {};
  const count = cfg.count || 12;
  const section = cfg.section;
  const values = [];
  let i, value;

  for (i = 0; i < count; ++i) {
    value = MONTHS[Math.ceil(i) % 12];
    values.push(value.substring(0, section));
  }

  return values;
};

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const numberWithCommas = (x: any) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/* eslint-disable no-nested-ternary */
export const transformPath = (path: string) => {
  // Remove leading slash and replace hyphens with spaces
  const formattedString = path.replace(/^\/|[-]/g, " ");

  // Capitalize each word
  const transformedString = formattedString.replace(/\b\w/g, (c) =>
    c.toUpperCase(),
  );

  return transformedString.trim();
};

export const linkNavigate = (path: string) => {
  return `/${path}`;
};

export const formatPhoneNumber = (input: string) => {
  let phoneNumber = input.trim().replace(/[^0-9+]/g, ""); // Remove non-numeric characters
  if (phoneNumber.startsWith("62")) {
    phoneNumber = phoneNumber.replace(/^62/, "+62");
  } else if (phoneNumber.startsWith("8")) {
    phoneNumber = phoneNumber.replace(/^8/, "+62");
  } else if (phoneNumber.startsWith("0")) {
    phoneNumber = phoneNumber.replace(/^0/, "+62");
  }
  return phoneNumber;
};

export const HandlePlan = ({ plan, sum }: { plan?: string; sum: number }) => {
  switch (plan) {
    case "MONTHLY":
      return formatRupiahV2(sum.toString());
    case "ANNUAL":
      return formatRupiahV2((sum * 12).toString());
    default:
      return formatRupiahV2(sum.toString());
  }
};

export const cleanData = (userInput: string): string => {
  return DOMPurify.sanitize(userInput);
};

export const truncateText = (text: string, maxLength: number): string => {
  {
    try {
      if (text.length <= maxLength) {
        return text;
      }
      return text.slice(0, maxLength) + "...";
    } catch (error) {
      return text;
    }
  }
};

export const getNameOrExtension = (filename: string): any => {
  // Regular expression to check if the string is a URL
  const urlRegex = /^(http|https):\/\/[^ "]+$/;

  if (urlRegex.test(filename)) {
    return filename; // If it's a URL, return it as is
  } else {
    const parts = filename.split(".");
    const extension = parts.length > 1 ? parts.pop() : ""; // Get the extension, default to empty string if no extension
    const name = parts.join("."); // Get the name

    return {
      name,
      extension,
    };
  }
};

export const hexToRgba = (hex: string, opacity: number): string => {
  // Ensure the hex color is valid
  const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(hex);
  if (!isValidHex) {
    throw new Error("Invalid hex color code");
  }

  // Remove the hash from the hex code
  const hexWithoutHash = hex.replace("#", "");

  // Parse the hex values for red, green, and blue
  const bigint = parseInt(hexWithoutHash, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Ensure the opacity value is within the valid range [0, 1]
  const validOpacity = Math.min(1, Math.max(0, opacity));

  // Return the RGBA color
  return `rgba(${r}, ${g}, ${b}, ${validOpacity})`;
};

export const capitalizeFirstLetter = (string: any) => {
  return string
    .replace(/\b\w/g, (match: any) => match.toUpperCase())
    .replace(/-/g, " ");
};

export const formatRupiah = (angka: string, prefix: string) => {
  let separator = "";
  const number_string = angka.replace(/[^,\d]/g, "").toString();
  const split = number_string.split(",");
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] !== undefined ? `${rupiah},${split[1]}` : rupiah;
  return prefix === undefined ? rupiah : rupiah ? `Rp. ${rupiah}` : "";
};

export const formatRupiahV2 = (amount: string) => {
  // Remove commas from the input string (if any)
  const cleanAmount =
    typeof amount === "string" ? amount.replace(/,/g, "") : amount;

  // Parse the cleaned amount as a float
  const parsedAmount = parseFloat(cleanAmount);

  // Check if the parsedAmount is a valid number
  if (isNaN(parsedAmount)) {
    return "Invalid input";
  }

  // Format the number as Rupiah with commas
  const formattedAmount = parsedAmount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    // minimumFractionDigits: 2,
    // maximumFractionDigits: 2,
  });

  return formattedAmount;
};

export const formatRupiahShort = (amount: number | string) => {
  const cleanAmount =
    typeof amount === "string" ? amount.replace(/,/g, "") : amount;

  const parsedAmount = parseFloat(cleanAmount as string);

  if (isNaN(parsedAmount)) {
    return "Invalid input";
  }

  const units = [
    { value: 1_000_000_000_000, symbol: "T" }, // Triliun
    { value: 1_000_000_000, symbol: "M" }, // Miliar
    { value: 1_000_000, symbol: "Jt" }, // Juta
    { value: 1_000, symbol: "Rb" }, // Ribu
  ];

  for (const unit of units) {
    if (parsedAmount >= unit.value) {
      return `Rp${(parsedAmount / unit.value).toFixed(1).replace(/\.0$/, "")}${unit.symbol}`;
    }
  }

  return `Rp${parsedAmount.toLocaleString("id-ID")}`;
};

export const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const removeEmptyValues = (object: any) => {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];
      if (value === null || value === undefined || value === "") {
        delete object[key];
      }
    }
  }
  return object;
};

export const transformStringToKey = (input: string): string => {
  const transformed = input.replace(/\s/g, "_").toUpperCase();

  return transformed;
};

// Function to format numbers with periods every third digit from the back
export const formatNumber = (number?: number): string => {
  const strNumber = number?.toString() || "0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(Number(strNumber));
};

export const currencyMask = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value;
  value = value.replace(/\D/g, "");
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  e.target.value = value;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
};
