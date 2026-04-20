import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import path from "path";

const fontDir = path.join(
  process.cwd(),
  "node_modules/@fontsource/source-sans-pro/files"
);

Font.register({
  family: "SourceSansPro",
  fonts: [
    { src: path.join(fontDir, "source-sans-pro-latin-400-normal.woff"), fontWeight: 400 },
    { src: path.join(fontDir, "source-sans-pro-latin-400-italic.woff"), fontWeight: 400, fontStyle: "italic" },
    { src: path.join(fontDir, "source-sans-pro-latin-600-normal.woff"), fontWeight: 600 },
    { src: path.join(fontDir, "source-sans-pro-latin-700-normal.woff"), fontWeight: 700 },
    { src: path.join(fontDir, "source-sans-pro-latin-700-italic.woff"), fontWeight: 700, fontStyle: "italic" },
  ],
});

const NAVY = "#102a43";
const TEAL = "#1a8a7d";
const SLATE = "#64748b";
const DARK = "#1e293b";
const RED = "#c0392b";
const GOLD_DARK = "#8b6914";

const s = StyleSheet.create({
  page: {
    fontFamily: "SourceSansPro",
    backgroundColor: "#ffffff",
    position: "relative",
  },

  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 90,
    height: 90,
    borderBottomRightRadius: 90,
    backgroundColor: NAVY,
    opacity: 0.9,
  },
  cornerTopLeftGold: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderBottomRightRadius: 60,
    backgroundColor: GOLD_DARK,
    opacity: 0.7,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 90,
    height: 90,
    borderTopLeftRadius: 90,
    backgroundColor: NAVY,
    opacity: 0.9,
  },
  cornerBottomRightGold: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderTopLeftRadius: 60,
    backgroundColor: GOLD_DARK,
    opacity: 0.7,
  },

  headerArea: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 10,
  },
  logoImage: {
    width: 200,
    height: 55,
    objectFit: "contain",
  },
  logoText: {
    fontSize: 22,
    fontWeight: 700,
    color: NAVY,
    marginTop: 5,
  },
  logoTextAccent: {
    color: "#e53935",
  },
  badge: {
    backgroundColor: RED,
    color: "white",
    paddingVertical: 6,
    paddingHorizontal: 28,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 3,
    marginTop: 14,
    textAlign: "center",
  },
  badgeGold: {
    backgroundColor: GOLD_DARK,
    color: "white",
    paddingVertical: 6,
    paddingHorizontal: 28,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 5,
    marginTop: 14,
    textAlign: "center",
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    marginTop: 12,
  },
  titleQurban: {
    fontSize: 32,
    fontWeight: 700,
    color: NAVY,
  },
  titleBerbagi: {
    fontSize: 32,
    fontWeight: 700,
    fontStyle: "italic",
    color: TEAL,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 12,
    color: SLATE,
    textAlign: "center",
    marginTop: 8,
  },

  recipientArea: {
    alignItems: "center",
    paddingVertical: 22,
    paddingHorizontal: 40,
  },
  recipientName: {
    fontSize: 22,
    fontWeight: 700,
    color: DARK,
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: NAVY,
    paddingBottom: 6,
  },

  thankYou: {
    textAlign: "center",
    color: SLATE,
    fontSize: 11,
    marginTop: 4,
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 40,
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flex: 1,
  },
  infoIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  infoIconText: {
    fontSize: 12,
    color: SLATE,
  },
  infoLabel: {
    fontSize: 10,
    color: "#94a3b8",
  },
  infoValue: {
    fontSize: 11,
    fontWeight: 600,
    color: DARK,
    marginTop: 1,
  },

  blessingArea: {
    paddingHorizontal: 50,
    paddingVertical: 16,
  },
  blessingText: {
    fontSize: 11,
    fontWeight: 700,
    color: TEAL,
    textAlign: "center",
    lineHeight: 1.6,
  },

  signatureArea: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 20,
  },
  signatureLine: {
    width: 120,
    borderBottomWidth: 1,
    borderBottomColor: DARK,
    marginBottom: 6,
  },
  signatureName: {
    fontWeight: 700,
    color: DARK,
    fontSize: 12,
    textAlign: "center",
  },
  signatureRole: {
    color: SLATE,
    fontSize: 9,
    textAlign: "center",
    marginTop: 2,
  },
});

export interface CertificateTemplateProps {
  mainName: string;
  slaughterDate: string;
  slaughterLocation: string;
  hijriYear: number;
  logoPath?: string;
}

function Corners() {
  return (
    <>
      <View style={s.cornerTopLeft} />
      <View style={s.cornerTopLeftGold} />
      <View style={s.cornerBottomRight} />
      <View style={s.cornerBottomRightGold} />
    </>
  );
}

function HeaderBlock({
  badge,
  badgeStyle,
  logoPath,
}: {
  badge: string;
  badgeStyle: "red" | "gold";
  logoPath?: string;
}) {
  return (
    <View style={s.headerArea}>
      {logoPath ? (
        <Image src={logoPath} style={s.logoImage} />
      ) : (
        <Text style={s.logoText}>
          <Text style={s.logoTextAccent}>rumah</Text>qurban
        </Text>
      )}
      <Text style={badgeStyle === "red" ? s.badge : s.badgeGold}>{badge}</Text>
      <View style={s.titleRow}>
        <Text style={s.titleQurban}>Qurban</Text>
        <Text style={s.titleBerbagi}>Berbagi</Text>
      </View>
      <Text style={s.subtitle}>Dipersembahkan Khusus Kepada :</Text>
    </View>
  );
}

function InfoBlock({
  name,
  location,
  date,
  hijriYear,
}: {
  name: string;
  location: string;
  date: string;
  hijriYear: number;
}) {
  return (
    <>
      <View style={s.recipientArea}>
        <Text style={s.recipientName}>{name}</Text>
      </View>
      <Text style={s.thankYou}>
        Terima kasih telah memilih berqurban di Rumah Qurban
      </Text>
      <View style={s.infoRow}>
        <View style={s.infoBox}>
          <View style={s.infoIconCircle}>
            <Text style={s.infoIconText}>O</Text>
          </View>
          <View>
            <Text style={s.infoLabel}>Lokasi</Text>
            <Text style={s.infoValue}>{location}</Text>
          </View>
        </View>
        <View style={s.infoBox}>
          <View style={s.infoIconCircle}>
            <Text style={s.infoIconText}>D</Text>
          </View>
          <View>
            <Text style={s.infoLabel}>Tanggal</Text>
            <Text style={s.infoValue}>
              {date} - {hijriYear} H
            </Text>
          </View>
        </View>
      </View>
      <View style={s.blessingArea}>
        <Text style={s.blessingText}>
          Semoga amal ibadah qurbannya diterima oleh Allah SWT dan senantiasa
          dirahmati dengan iman, ilmu, amal shaleh serta akhlak yang mulia, dan
          juga kebaikan di dunia dan akhirat. Aamiin
        </Text>
      </View>
    </>
  );
}

export function CertificateTemplate(props: CertificateTemplateProps) {
  return (
    <Document>
      {/* Page 1: LAPORAN */}
      <Page size="A4" style={s.page}>
        <Corners />
        <HeaderBlock badge="LAPORAN" badgeStyle="red" logoPath={props.logoPath} />
        <InfoBlock
          name={props.mainName}
          location={props.slaughterLocation}
          date={props.slaughterDate}
          hijriYear={props.hijriYear}
        />
        <View style={s.signatureArea}>
          <View style={s.signatureLine} />
          <Text style={s.signatureName}>Edhu Enriadis Adilingga</Text>
          <Text style={s.signatureRole}>Project Leader Rumah Qurban</Text>
        </View>
      </Page>

      {/* Page 2: SERTIFIKAT */}
      <Page size="A4" style={s.page}>
        <Corners />
        <HeaderBlock badge="S E R T I F I K A T" badgeStyle="gold" logoPath={props.logoPath} />
        <InfoBlock
          name={props.mainName}
          location={props.slaughterLocation}
          date={props.slaughterDate}
          hijriYear={props.hijriYear}
        />
      </Page>
    </Document>
  );
}
