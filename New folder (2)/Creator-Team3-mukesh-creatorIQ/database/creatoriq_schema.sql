--
-- PostgreSQL database dump
--

\restrict AmNh8eNSJVV39SGClRXit8zxHoAFy5x3bGT5k8x6dJuAv2hnJcaqBswJN2xhNlu

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-06 13:49:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16421)
-- Name: analytics_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analytics_data (
    analytics_id integer NOT NULL,
    creator_id integer NOT NULL,
    views integer DEFAULT 0,
    likes integer DEFAULT 0,
    comments integer DEFAULT 0,
    shares integer DEFAULT 0
);


ALTER TABLE public.analytics_data OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16420)
-- Name: analytics_data_analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analytics_data_analytics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.analytics_data_analytics_id_seq OWNER TO postgres;

--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 223
-- Name: analytics_data_analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analytics_data_analytics_id_seq OWNED BY public.analytics_data.analytics_id;


--
-- TOC entry 228 (class 1259 OID 16456)
-- Name: audience_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audience_data (
    audience_id integer NOT NULL,
    account_id integer NOT NULL,
    demographics character varying(100),
    age character varying(20),
    gender character varying(20),
    location character varying(100)
);


ALTER TABLE public.audience_data OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16455)
-- Name: audience_data_audience_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audience_data_audience_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audience_data_audience_id_seq OWNER TO postgres;

--
-- TOC entry 5067 (class 0 OID 0)
-- Dependencies: 227
-- Name: audience_data_audience_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audience_data_audience_id_seq OWNED BY public.audience_data.audience_id;


--
-- TOC entry 222 (class 1259 OID 16404)
-- Name: creator_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.creator_profile (
    creator_id integer NOT NULL,
    user_id integer NOT NULL,
    platform character varying(50) NOT NULL,
    followers integer DEFAULT 0,
    engagement_rate numeric(5,2) DEFAULT 0.00
);


ALTER TABLE public.creator_profile OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16403)
-- Name: creator_profile_creator_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.creator_profile_creator_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.creator_profile_creator_id_seq OWNER TO postgres;

--
-- TOC entry 5068 (class 0 OID 0)
-- Dependencies: 221
-- Name: creator_profile_creator_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.creator_profile_creator_id_seq OWNED BY public.creator_profile.creator_id;


--
-- TOC entry 226 (class 1259 OID 16439)
-- Name: social_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.social_accounts (
    account_id integer NOT NULL,
    creator_id integer NOT NULL,
    platform character varying(50) NOT NULL,
    account_name character varying(100) NOT NULL,
    followers integer DEFAULT 0
);


ALTER TABLE public.social_accounts OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16438)
-- Name: social_accounts_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.social_accounts_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_accounts_account_id_seq OWNER TO postgres;

--
-- TOC entry 5069 (class 0 OID 0)
-- Dependencies: 225
-- Name: social_accounts_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.social_accounts_account_id_seq OWNED BY public.social_accounts.account_id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4880 (class 2604 OID 16424)
-- Name: analytics_data analytics_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_data ALTER COLUMN analytics_id SET DEFAULT nextval('public.analytics_data_analytics_id_seq'::regclass);


--
-- TOC entry 4887 (class 2604 OID 16459)
-- Name: audience_data audience_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audience_data ALTER COLUMN audience_id SET DEFAULT nextval('public.audience_data_audience_id_seq'::regclass);


--
-- TOC entry 4877 (class 2604 OID 16407)
-- Name: creator_profile creator_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creator_profile ALTER COLUMN creator_id SET DEFAULT nextval('public.creator_profile_creator_id_seq'::regclass);


--
-- TOC entry 4885 (class 2604 OID 16442)
-- Name: social_accounts account_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_accounts ALTER COLUMN account_id SET DEFAULT nextval('public.social_accounts_account_id_seq'::regclass);


--
-- TOC entry 4876 (class 2604 OID 16393)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5056 (class 0 OID 16421)
-- Dependencies: 224
-- Data for Name: analytics_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analytics_data (analytics_id, creator_id, views, likes, comments, shares) FROM stdin;
1	1	150000	12000	850	450
2	1	80000	9000	1200	300
\.


--
-- TOC entry 5060 (class 0 OID 16456)
-- Dependencies: 228
-- Data for Name: audience_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audience_data (audience_id, account_id, demographics, age, gender, location) FROM stdin;
1	1	Tech Enthusiasts	18-24	Female	India
2	2	Students	25-34	Male	USA
\.


--
-- TOC entry 5054 (class 0 OID 16404)
-- Dependencies: 222
-- Data for Name: creator_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.creator_profile (creator_id, user_id, platform, followers, engagement_rate) FROM stdin;
1	1	YouTube	25000	6.75
\.


--
-- TOC entry 5058 (class 0 OID 16439)
-- Dependencies: 226
-- Data for Name: social_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_accounts (account_id, creator_id, platform, account_name, followers) FROM stdin;
1	1	YouTube	Sonali Tech	25000
2	1	Instagram	sonali.tech	18000
\.


--
-- TOC entry 5052 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, role) FROM stdin;
1	sonali	sonali@example.com	hashed_password_123	Creator
\.


--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 223
-- Name: analytics_data_analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analytics_data_analytics_id_seq', 1, false);


--
-- TOC entry 5072 (class 0 OID 0)
-- Dependencies: 227
-- Name: audience_data_audience_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audience_data_audience_id_seq', 2, true);


--
-- TOC entry 5073 (class 0 OID 0)
-- Dependencies: 221
-- Name: creator_profile_creator_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.creator_profile_creator_id_seq', 1, true);


--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 225
-- Name: social_accounts_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.social_accounts_account_id_seq', 2, true);


--
-- TOC entry 5075 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- TOC entry 4895 (class 2606 OID 16432)
-- Name: analytics_data analytics_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_data
    ADD CONSTRAINT analytics_data_pkey PRIMARY KEY (analytics_id);


--
-- TOC entry 4899 (class 2606 OID 16463)
-- Name: audience_data audience_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audience_data
    ADD CONSTRAINT audience_data_pkey PRIMARY KEY (audience_id);


--
-- TOC entry 4893 (class 2606 OID 16414)
-- Name: creator_profile creator_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creator_profile
    ADD CONSTRAINT creator_profile_pkey PRIMARY KEY (creator_id);


--
-- TOC entry 4897 (class 2606 OID 16449)
-- Name: social_accounts social_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_accounts
    ADD CONSTRAINT social_accounts_pkey PRIMARY KEY (account_id);


--
-- TOC entry 4889 (class 2606 OID 16402)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4891 (class 2606 OID 16400)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4901 (class 2606 OID 16433)
-- Name: analytics_data fk_creator; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_data
    ADD CONSTRAINT fk_creator FOREIGN KEY (creator_id) REFERENCES public.creator_profile(creator_id) ON DELETE CASCADE;


--
-- TOC entry 4902 (class 2606 OID 16450)
-- Name: social_accounts fk_creator_profile; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_accounts
    ADD CONSTRAINT fk_creator_profile FOREIGN KEY (creator_id) REFERENCES public.creator_profile(creator_id) ON DELETE CASCADE;


--
-- TOC entry 4903 (class 2606 OID 16464)
-- Name: audience_data fk_social_account_audience; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audience_data
    ADD CONSTRAINT fk_social_account_audience FOREIGN KEY (account_id) REFERENCES public.social_accounts(account_id) ON DELETE CASCADE;


--
-- TOC entry 4900 (class 2606 OID 16415)
-- Name: creator_profile fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creator_profile
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-07-06 13:49:48

--
-- PostgreSQL database dump complete
--

\unrestrict AmNh8eNSJVV39SGClRXit8zxHoAFy5x3bGT5k8x6dJuAv2hnJcaqBswJN2xhNlu

