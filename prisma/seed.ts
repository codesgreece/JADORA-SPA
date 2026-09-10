import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const siteContent: Record<string, string> = {
  brandName: "J’ADORA",
  brandTagline: "Luxury Girls Spa Parties",
  brandByline: "by Jo",
  heroTitle: "Αγάπη για τα παιδιά.\nΠάθος για την ομορφιά.\nΜοναδικές στιγμές.",
  heroDescription: `Η δημιουργία των Jadora Girls Spa Parties ξεκίνησε από την επιθυμία μου να ενώσω την παιδαγωγική μου κατάρτιση και την επαγγελματική μου εμπειρία στον χώρο της αισθητικής με κάτι πραγματικά ξεχωριστό.

Με σπουδές στα Παιδαγωγικά, πτυχίο και άδεια άσκησης επαγγέλματος στον χώρο της αισθητικής, δημιουργούμε εμπειρίες σχεδιασμένες ειδικά για παιδιά, με έμφαση στη διασκέδαση, τη δημιουργικότητα και την όμορφη ατμόσφαιρα.

Κάθε λεπτομέρεια έχει σχεδιαστεί για να κάνει το party ξεχωριστό. Από το beauty corner και το pampering μέχρι τα χρώματα, τη διακόσμηση και τις δραστηριότητες, κάθε Girls Spa Party γίνεται μια μικρή εμπειρία γεμάτη χαμόγελα.

Διοργανώνουμε παιδικά spa parties για κορίτσια από 4 ετών, που έχουν σχεδιαστεί με ιδιαίτερη προσοχή στη λεπτομέρεια, με υψηλής ποιότητας υλικά και με μια αίσθηση boutique περιποίησης που μετατρέπει κάθε στιγμή σε εμπειρία.`,
  heroCta: "Μάθε περισσότερα →",
  bookingTitle: "Κλείσε την ημερομηνία σου",
  bookingSubtitle: "Επίλεξε ημερομηνία και ώρα για να ζήσεις μια μοναδική εμπειρία!",
  vibeText: "More than a party it's a vibe ♡",
  servicesTitle: "Οι υπηρεσίες μας",
  packagesTitle: "Πακέτα & Τιμές",
  extrasTitle: "Extras / Έξτρα υπηρεσίες",
  partnersTitle: "Οι συνεργάτες μας",
  galleryTitle: "Στιγμές J’ADORA",
  aboutTitle: "Σχετικά με εμάς",
  contactTitle: "Επικοινωνία",
  contactEmail: "hello@jadora.gr",
  contactPhone: "+30 210 000 0000",
  contactAddress: "Αθήνα, Ελλάδα",
  socialInstagram: "https://instagram.com/jadora",
  socialFacebook: "https://facebook.com/jadora",
  footerText: "© J’ADORA Luxury Girls Spa Parties — Με αγάπη, by Jo",
  seoTitle: "J’ADORA | Luxury Girls Spa Parties",
  seoDescription:
    "Παιδικά spa parties για κορίτσια από 4 ετών. Boutique εμπειρίες ομορφιάς, δημιουργικότητας και χαμόγελου.",
  ctaBook: "Κράτηση τώρα ♡",
  navHome: "Αρχική",
  navServices: "Υπηρεσίες",
  navPackages: "Πακέτα",
  navCalendar: "Ημερολόγιο",
  navAbout: "Σχετικά",
  navContact: "Επικοινωνία",
};

async function main() {
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "jadora2026",
    10
  );

  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@jadora.gr" },
    update: { passwordHash },
    create: {
      email: process.env.ADMIN_EMAIL || "admin@jadora.gr",
      passwordHash,
      name: "Jadora Admin",
    },
  });

  for (const [key, value] of Object.entries(siteContent)) {
    await prisma.siteContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  const packages = [
    {
      name: "Petite Party",
      maxGirls: 8,
      durationHrs: 2,
      price: 220,
      description: "Ιδανικό για μικρά πάρτι με φίλες.",
      featured: false,
      sortOrder: 1,
    },
    {
      name: "Glamour Party",
      maxGirls: 15,
      durationHrs: 3,
      price: 290,
      description: "Το πιο δημοφιλές πακέτο για αξέχαστες στιγμές.",
      featured: true,
      sortOrder: 2,
    },
    {
      name: "Royal Party",
      maxGirls: 20,
      durationHrs: 4,
      price: 330,
      description: "Μεγάλη γιορτή με πλήρη spa εμπειρία.",
      featured: false,
      sortOrder: 3,
    },
  ];

  const existingPackages = await prisma.package.count();
  if (existingPackages === 0) {
    await prisma.package.createMany({ data: packages });
  }

  const services = [
    {
      title: "Στολισμός χώρου",
      description:
        "Στολισμός του χώρου σας, όπου εσείς επιθυμείτε, προσαρμοσμένος στο concept.",
      icon: "decor",
      sortOrder: 1,
    },
    {
      title: "Ρομπάκια",
      description: "Ροζ, Μωβ, Λευκό, Μαύρο floral",
      icon: "robe",
      sortOrder: 2,
    },
    {
      title: "Κορδέλες",
      description: "Μαύρο, Ροζ, Μωβ",
      icon: "ribbon",
      sortOrder: 3,
    },
    {
      title: "Μουσική",
      description: "Ειδικά curated playlist για τη διάθεση του party.",
      icon: "music",
      sortOrder: 4,
    },
    {
      title: "Ποτηράκια σαμπάνιας",
      description: "Για μια γιορτινή, glam ατμόσφαιρα.",
      icon: "champagne",
      sortOrder: 5,
    },
    {
      title: "Μανικιούρ",
      description:
        "Παιδικά χρώματα με βάση το νερό ή απλό βερνίκι που αφαιρείται με ασετόν.",
      icon: "manicure",
      sortOrder: 6,
    },
    {
      title: "Μάσκα προσώπου",
      description: "Αναζωογονητική μάσκα — γιαούρτι ή σοκολάτα.",
      icon: "mask",
      sortOrder: 7,
    },
    {
      title: "Λαμπερά χτενίσματα",
      description: "Όμορφα και άνετα χτενίσματα για κάθε ηλικία.",
      icon: "hair",
      sortOrder: 8,
    },
    {
      title: "Απαλό παιδικό μακιγιάζ",
      description: "Απαλό, ασφαλές μακιγιάζ σχεδιασμένο για παιδιά.",
      icon: "makeup",
      sortOrder: 9,
    },
    {
      title: "Photo corner + props",
      description: "Φωτογραφική γωνιά με props για αξέχαστες φωτογραφίες.",
      icon: "photo",
      sortOrder: 10,
    },
    {
      title: "Καθρεφτάκια-δώρο",
      description:
        "Καθρεφτάκια που διακοσμούν τα ίδια τα παιδιά και κρατούν ως αναμνηστικό.",
      icon: "mirror",
      sortOrder: 11,
    },
    {
      title: "Glitter bar",
      description: "Λάμψη και glitter για την τέλεια spa διάθεση.",
      icon: "glitter",
      sortOrder: 12,
    },
  ];

  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({ data: services });
  }

  const slots = ["10:00", "12:00", "14:00", "16:00", "18:00"];
  for (let i = 0; i < slots.length; i++) {
    await prisma.timeSlotConfig.upsert({
      where: { time: slots[i] },
      update: { enabled: true, sortOrder: i },
      create: { time: slots[i], enabled: true, sortOrder: i },
    });
  }

  for (let day = 0; day < 7; day++) {
    const existing = await prisma.workingHours.findFirst({
      where: { dayOfWeek: day },
    });
    if (!existing) {
      await prisma.workingHours.create({
        data: {
          dayOfWeek: day,
          startTime: "10:00",
          endTime: "18:00",
          enabled: true,
        },
      });
    }
  }

  const gallery = [
    {
      url: "/hero-spa.jpg",
      caption: "Girls Spa Party vibes",
      sortOrder: 1,
    },
    {
      url: "/gallery/moment-1.svg",
      caption: "Pampering moments",
      sortOrder: 2,
    },
    {
      url: "/gallery/moment-2.svg",
      caption: "Beauty corner",
      sortOrder: 3,
    },
    {
      url: "/gallery/moment-3.svg",
      caption: "Glitter & smiles",
      sortOrder: 4,
    },
    {
      url: "/gallery/moment-4.svg",
      caption: "Photo corner",
      sortOrder: 5,
    },
    {
      url: "/gallery/moment-5.svg",
      caption: "Friendship & fun",
      sortOrder: 6,
    },
  ];

  if ((await prisma.galleryImage.count()) === 0) {
    await prisma.galleryImage.createMany({ data: gallery });
  }

  // Sample availability blocks & bookings for demo
  const pkg = await prisma.package.findFirst({ where: { featured: true } });
  if (pkg && (await prisma.booking.count()) === 0) {
    const customer = await prisma.customer.create({
      data: {
        name: "Μαρία Παπαδοπούλου",
        email: "maria@example.com",
        phone: "+30 6900000001",
      },
    });
    const customer2 = await prisma.customer.create({
      data: {
        name: "Ελένη Νικολάου",
        email: "eleni@example.com",
        phone: "+30 6900000002",
      },
    });

    await prisma.booking.create({
      data: {
        customerId: customer.id,
        packageId: pkg.id,
        date: "2026-09-20",
        timeSlot: "14:00",
        girlsCount: 10,
        status: "confirmed",
        totalPrice: pkg.price,
      },
    });
    await prisma.booking.create({
      data: {
        customerId: customer2.id,
        packageId: pkg.id,
        date: "2026-09-22",
        timeSlot: "12:00",
        girlsCount: 8,
        status: "pending",
        totalPrice: pkg.price,
      },
    });

    await prisma.message.createMany({
      data: [
        {
          name: "Αννα",
          email: "anna@example.com",
          subject: "Ερώτηση για πακέτο",
          body: "Καλησπέρα! Θα ήθελα πληροφορίες για το πακέτο των 15 κοριτσιών.",
        },
        {
          name: "Σοφία",
          email: "sofia@example.com",
          subject: "Διαθεσιμότητα",
          body: "Έχετε διαθέσιμη ημερομηνία το Σάββατο 28/9;",
        },
        {
          name: "Κατερίνα",
          email: "katerina@example.com",
          subject: "Δώρο γενεθλίων",
          body: "Θέλουμε να κλείσουμε για τα γενέθλια της κόρης μου.",
        },
      ],
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
