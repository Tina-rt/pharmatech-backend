--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_commande_statut; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_commande_statut AS ENUM (
    'en attente',
    'en cours',
    'expediee',
    'livree',
    'annulee'
);


ALTER TYPE public.enum_commande_statut OWNER TO postgres;

--
-- Name: enum_facture_statut_paiement; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_facture_statut_paiement AS ENUM (
    'en attente',
    'paye',
    'partiellement paye',
    'rembourse'
);


ALTER TYPE public.enum_facture_statut_paiement OWNER TO postgres;

--
-- Name: enum_livraison_statut_livraison; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_livraison_statut_livraison AS ENUM (
    'En attente',
    'En transit',
    'Livree',
    'Retour'
);


ALTER TYPE public.enum_livraison_statut_livraison OWNER TO postgres;

--
-- Name: enum_paiement_mode_paiement; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_paiement_mode_paiement AS ENUM (
    'carte',
    'virement',
    'mobile money'
);


ALTER TYPE public.enum_paiement_mode_paiement OWNER TO postgres;

--
-- Name: enum_paiement_statut_paiement; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_paiement_statut_paiement AS ENUM (
    'en attente',
    'paye',
    'echec'
);


ALTER TYPE public.enum_paiement_statut_paiement OWNER TO postgres;

--
-- Name: enum_panier_statut; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_panier_statut AS ENUM (
    'actif',
    'pret',
    'valide',
    'commande',
    'ferme'
);


ALTER TYPE public.enum_panier_statut OWNER TO postgres;

--
-- Name: enum_utilisateur_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_utilisateur_role AS ENUM (
    'admin',
    'client'
);


ALTER TYPE public.enum_utilisateur_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: adresse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adresse (
    id integer NOT NULL,
    pays character varying(50) NOT NULL,
    ville character varying(50) NOT NULL,
    code_postal integer NOT NULL,
    code_adresse character varying(50) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.adresse OWNER TO postgres;

--
-- Name: adresse_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.adresse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.adresse_id_seq OWNER TO postgres;

--
-- Name: adresse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.adresse_id_seq OWNED BY public.adresse.id;


--
-- Name: categorie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorie (
    id integer NOT NULL,
    nom character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.categorie OWNER TO postgres;

--
-- Name: categorie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categorie_id_seq OWNER TO postgres;

--
-- Name: categorie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorie_id_seq OWNED BY public.categorie.id;


--
-- Name: commande; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commande (
    id integer NOT NULL,
    utilisateur_id integer,
    panier_id integer,
    date_commande timestamp with time zone,
    statut public.enum_commande_statut DEFAULT 'en attente'::public.enum_commande_statut,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.commande OWNER TO postgres;

--
-- Name: commandeProduit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."commandeProduit" (
    id integer NOT NULL,
    commande_id integer,
    produit_id integer,
    prix_unitaire numeric,
    quantite integer,
    "prixHTtotal" numeric,
    tva_pourcentage numeric,
    "prixTVA" numeric,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."commandeProduit" OWNER TO postgres;

--
-- Name: commandeProduit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."commandeProduit_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."commandeProduit_id_seq" OWNER TO postgres;

--
-- Name: commandeProduit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."commandeProduit_id_seq" OWNED BY public."commandeProduit".id;


--
-- Name: commande_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commande_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.commande_id_seq OWNER TO postgres;

--
-- Name: commande_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.commande_id_seq OWNED BY public.commande.id;


--
-- Name: facture; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facture (
    id integer NOT NULL,
    commande_id integer NOT NULL,
    numero_facture character varying(255) NOT NULL,
    date_emission timestamp with time zone NOT NULL,
    montant_total numeric(10,2) NOT NULL,
    statut_paiement public.enum_facture_statut_paiement DEFAULT 'en attente'::public.enum_facture_statut_paiement NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.facture OWNER TO postgres;

--
-- Name: facture_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.facture_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.facture_id_seq OWNER TO postgres;

--
-- Name: facture_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.facture_id_seq OWNED BY public.facture.id;


--
-- Name: livraison; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.livraison (
    id integer NOT NULL,
    commande_id integer NOT NULL,
    nom character varying(255) NOT NULL,
    prenom character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    adresse character varying(255) NOT NULL,
    prescription character varying(255),
    ville character varying(255) NOT NULL,
    code_postal character varying(255) NOT NULL,
    date_livraison timestamp with time zone,
    transporteur character varying(255),
    numero_suivi character varying(255),
    statut_livraison public.enum_livraison_statut_livraison DEFAULT 'En attente'::public.enum_livraison_statut_livraison,
    methode_livraison_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.livraison OWNER TO postgres;

--
-- Name: livraison_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.livraison_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.livraison_id_seq OWNER TO postgres;

--
-- Name: livraison_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.livraison_id_seq OWNED BY public.livraison.id;


--
-- Name: methodeLivraison; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."methodeLivraison" (
    id integer NOT NULL,
    nom character varying(255) NOT NULL,
    description text NOT NULL,
    prix numeric(10,2) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."methodeLivraison" OWNER TO postgres;

--
-- Name: methodeLivraison_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."methodeLivraison_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."methodeLivraison_id_seq" OWNER TO postgres;

--
-- Name: methodeLivraison_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."methodeLivraison_id_seq" OWNED BY public."methodeLivraison".id;


--
-- Name: paiement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paiement (
    id integer NOT NULL,
    commande_id integer,
    montant numeric,
    date_paiement timestamp with time zone,
    mode_paiement public.enum_paiement_mode_paiement,
    statut_paiement public.enum_paiement_statut_paiement DEFAULT 'en attente'::public.enum_paiement_statut_paiement,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.paiement OWNER TO postgres;

--
-- Name: paiement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paiement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.paiement_id_seq OWNER TO postgres;

--
-- Name: paiement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paiement_id_seq OWNED BY public.paiement.id;


--
-- Name: panier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.panier (
    id integer NOT NULL,
    utilisateur_id integer,
    statut public.enum_panier_statut DEFAULT 'actif'::public.enum_panier_statut NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.panier OWNER TO postgres;

--
-- Name: panierProduit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."panierProduit" (
    id integer NOT NULL,
    panier_id integer,
    produit_id integer,
    quantite integer,
    prix_unitaire numeric,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."panierProduit" OWNER TO postgres;

--
-- Name: panierProduit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."panierProduit_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."panierProduit_id_seq" OWNER TO postgres;

--
-- Name: panierProduit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."panierProduit_id_seq" OWNED BY public."panierProduit".id;


--
-- Name: panier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.panier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.panier_id_seq OWNER TO postgres;

--
-- Name: panier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.panier_id_seq OWNED BY public.panier.id;


--
-- Name: produit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produit (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    description text NOT NULL,
    prix numeric(10,2) NOT NULL,
    image character varying(250) NOT NULL,
    categorie_id integer NOT NULL,
    marque character varying(100) NOT NULL,
    numero_serie character varying(100),
    caracteristique_principale text NOT NULL,
    reduction numeric(5,2) DEFAULT 0,
    tva_pourcentage numeric(5,2) DEFAULT 20 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.produit OWNER TO postgres;

--
-- Name: produit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.produit_id_seq OWNER TO postgres;

--
-- Name: produit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produit_id_seq OWNED BY public.produit.id;


--
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateur (
    id integer NOT NULL,
    nom character varying(255) NOT NULL,
    prenom character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    motdepasse character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    role public.enum_utilisateur_role DEFAULT 'client'::public.enum_utilisateur_role NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.utilisateur OWNER TO postgres;

--
-- Name: utilisateur_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateur_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilisateur_id_seq OWNER TO postgres;

--
-- Name: utilisateur_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateur_id_seq OWNED BY public.utilisateur.id;


--
-- Name: adresse id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adresse ALTER COLUMN id SET DEFAULT nextval('public.adresse_id_seq'::regclass);


--
-- Name: categorie id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorie ALTER COLUMN id SET DEFAULT nextval('public.categorie_id_seq'::regclass);


--
-- Name: commande id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande ALTER COLUMN id SET DEFAULT nextval('public.commande_id_seq'::regclass);


--
-- Name: commandeProduit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."commandeProduit" ALTER COLUMN id SET DEFAULT nextval('public."commandeProduit_id_seq"'::regclass);


--
-- Name: facture id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facture ALTER COLUMN id SET DEFAULT nextval('public.facture_id_seq'::regclass);


--
-- Name: livraison id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livraison ALTER COLUMN id SET DEFAULT nextval('public.livraison_id_seq'::regclass);


--
-- Name: methodeLivraison id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."methodeLivraison" ALTER COLUMN id SET DEFAULT nextval('public."methodeLivraison_id_seq"'::regclass);


--
-- Name: paiement id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiement ALTER COLUMN id SET DEFAULT nextval('public.paiement_id_seq'::regclass);


--
-- Name: panier id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.panier ALTER COLUMN id SET DEFAULT nextval('public.panier_id_seq'::regclass);


--
-- Name: panierProduit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."panierProduit" ALTER COLUMN id SET DEFAULT nextval('public."panierProduit_id_seq"'::regclass);


--
-- Name: produit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produit ALTER COLUMN id SET DEFAULT nextval('public.produit_id_seq'::regclass);


--
-- Name: utilisateur id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur ALTER COLUMN id SET DEFAULT nextval('public.utilisateur_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
001-create-utilisateur.js
002-create-categorie.js
003-create-produit.js
004-create-panier.js
006-create-panier-produit.js
007-create-commande.js
008-create-paiement.js
009-create-methode-livraison.js
010-create-livraison.js
011-create-facture.js
012-create-commande-produit.js
20240806044153-create-adresse.js
\.


--
-- Data for Name: adresse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adresse (id, pays, ville, code_postal, code_adresse, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: categorie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorie (id, nom, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: commande; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.commande (id, utilisateur_id, panier_id, date_commande, statut, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: commandeProduit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."commandeProduit" (id, commande_id, produit_id, prix_unitaire, quantite, "prixHTtotal", tva_pourcentage, "prixTVA", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: facture; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facture (id, commande_id, numero_facture, date_emission, montant_total, statut_paiement, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: livraison; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.livraison (id, commande_id, nom, prenom, email, phone, adresse, prescription, ville, code_postal, date_livraison, transporteur, numero_suivi, statut_livraison, methode_livraison_id, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: methodeLivraison; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."methodeLivraison" (id, nom, description, prix, "createdAt", "updatedAt", "deletedAt") FROM stdin;
13	Tarif Forfaitaire	Livraison forfaitaire standard pour tous les articles	3000.00	2024-09-06 00:25:16.675+02	2024-09-06 00:25:16.675+02	\N
14	Livraison Accélérée	Livraison accélérée pour recevoir l'envoi en un jour ou deux	8000.00	2024-09-06 00:25:16.675+02	2024-09-06 00:25:16.675+02	\N
15	Livraison en 24 Heures	Une option coûteuse pour recevoir l'envoi le jour ouvrable suivant	10000.00	2024-09-06 00:25:16.675+02	2024-09-06 00:25:16.675+02	\N
\.


--
-- Data for Name: paiement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paiement (id, commande_id, montant, date_paiement, mode_paiement, statut_paiement, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: panier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.panier (id, utilisateur_id, statut, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: panierProduit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."panierProduit" (id, panier_id, produit_id, quantite, prix_unitaire, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: produit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produit (id, nom, description, prix, image, categorie_id, marque, numero_serie, caracteristique_principale, reduction, tva_pourcentage, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateur (id, nom, prenom, email, motdepasse, phone, role, "createdAt", "updatedAt", "deletedAt") FROM stdin;
3	ADMIN	Admin	rakotomaroharilala5@gmail.com	$2b$10$7A4rexRo0r9CVJm5SzP1..A3TsRelWQ74D56un6lH5KnPWBd/8i5K	0340417324	admin	2024-09-06 00:25:16.968+02	2024-09-06 00:25:16.968+02	\N
8	RAKOTOMARO	Harilala	harilalarakotomaro@gmail.com	$2b$10$OQKXQiexaYt0RwNYZOqpDO/Lp728FRCmLKwX3q0KgFciIrLwykV0e	0340417324	client	2024-09-06 01:36:25.264+02	2024-09-06 01:36:25.264+02	\N
\.


--
-- Name: adresse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.adresse_id_seq', 1, false);


--
-- Name: categorie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorie_id_seq', 1, false);


--
-- Name: commandeProduit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."commandeProduit_id_seq"', 1, false);


--
-- Name: commande_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commande_id_seq', 1, false);


--
-- Name: facture_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.facture_id_seq', 1, false);


--
-- Name: livraison_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.livraison_id_seq', 1, false);


--
-- Name: methodeLivraison_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."methodeLivraison_id_seq"', 15, true);


--
-- Name: paiement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paiement_id_seq', 1, false);


--
-- Name: panierProduit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."panierProduit_id_seq"', 1, false);


--
-- Name: panier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.panier_id_seq', 1, false);


--
-- Name: produit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produit_id_seq', 1, false);


--
-- Name: utilisateur_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateur_id_seq', 8, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: adresse adresse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adresse
    ADD CONSTRAINT adresse_pkey PRIMARY KEY (id);


--
-- Name: categorie categorie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorie
    ADD CONSTRAINT categorie_pkey PRIMARY KEY (id);


--
-- Name: commandeProduit commandeProduit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."commandeProduit"
    ADD CONSTRAINT "commandeProduit_pkey" PRIMARY KEY (id);


--
-- Name: commande commande_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande
    ADD CONSTRAINT commande_pkey PRIMARY KEY (id);


--
-- Name: facture facture_numero_facture_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facture
    ADD CONSTRAINT facture_numero_facture_key UNIQUE (numero_facture);


--
-- Name: facture facture_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facture
    ADD CONSTRAINT facture_pkey PRIMARY KEY (id);


--
-- Name: livraison livraison_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livraison
    ADD CONSTRAINT livraison_pkey PRIMARY KEY (id);


--
-- Name: methodeLivraison methodeLivraison_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."methodeLivraison"
    ADD CONSTRAINT "methodeLivraison_pkey" PRIMARY KEY (id);


--
-- Name: paiement paiement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiement
    ADD CONSTRAINT paiement_pkey PRIMARY KEY (id);


--
-- Name: panierProduit panierProduit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."panierProduit"
    ADD CONSTRAINT "panierProduit_pkey" PRIMARY KEY (id);


--
-- Name: panier panier_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.panier
    ADD CONSTRAINT panier_pkey PRIMARY KEY (id);


--
-- Name: produit produit_numero_serie_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produit
    ADD CONSTRAINT produit_numero_serie_key UNIQUE (numero_serie);


--
-- Name: produit produit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produit
    ADD CONSTRAINT produit_pkey PRIMARY KEY (id);


--
-- Name: utilisateur utilisateur_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_email_key UNIQUE (email);


--
-- Name: utilisateur utilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (id);


--
-- Name: commandeProduit commandeProduit_commande_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."commandeProduit"
    ADD CONSTRAINT "commandeProduit_commande_id_fkey" FOREIGN KEY (commande_id) REFERENCES public.commande(id);


--
-- Name: commandeProduit commandeProduit_produit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."commandeProduit"
    ADD CONSTRAINT "commandeProduit_produit_id_fkey" FOREIGN KEY (produit_id) REFERENCES public.produit(id);


--
-- Name: commande commande_panier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande
    ADD CONSTRAINT commande_panier_id_fkey FOREIGN KEY (panier_id) REFERENCES public.panier(id);


--
-- Name: commande commande_utilisateur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande
    ADD CONSTRAINT commande_utilisateur_id_fkey FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateur(id);


--
-- Name: facture facture_commande_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facture
    ADD CONSTRAINT facture_commande_id_fkey FOREIGN KEY (commande_id) REFERENCES public.commande(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: livraison livraison_commande_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livraison
    ADD CONSTRAINT livraison_commande_id_fkey FOREIGN KEY (commande_id) REFERENCES public.commande(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: livraison livraison_methode_livraison_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livraison
    ADD CONSTRAINT livraison_methode_livraison_id_fkey FOREIGN KEY (methode_livraison_id) REFERENCES public."methodeLivraison"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: paiement paiement_commande_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiement
    ADD CONSTRAINT paiement_commande_id_fkey FOREIGN KEY (commande_id) REFERENCES public.commande(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: panierProduit panierProduit_panier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."panierProduit"
    ADD CONSTRAINT "panierProduit_panier_id_fkey" FOREIGN KEY (panier_id) REFERENCES public.panier(id);


--
-- Name: panierProduit panierProduit_produit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."panierProduit"
    ADD CONSTRAINT "panierProduit_produit_id_fkey" FOREIGN KEY (produit_id) REFERENCES public.produit(id);


--
-- Name: panier panier_utilisateur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.panier
    ADD CONSTRAINT panier_utilisateur_id_fkey FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateur(id);


--
-- Name: produit produit_categorie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produit
    ADD CONSTRAINT produit_categorie_id_fkey FOREIGN KEY (categorie_id) REFERENCES public.categorie(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

