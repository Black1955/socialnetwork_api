toc.dat                                                                                             0000600 0004000 0002000 00000033761 14445310757 0014463 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP           %                {           socialnetwork    15.2    15.2 -    /           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         0           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         1           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         2           1262    24596    socialnetwork    DATABASE     �   CREATE DATABASE socialnetwork WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE socialnetwork;
                postgres    false         �            1259    24611    posts    TABLE       CREATE TABLE public.posts (
    id integer NOT NULL,
    title character varying(25),
    description character varying(255),
    likes integer DEFAULT 0,
    "time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    img_url character varying(255),
    user_id integer
);
    DROP TABLE public.posts;
       public         heap    postgres    false         �            1255    40968 '   followsposts(integer, integer, integer)    FUNCTION     )  CREATE FUNCTION public.followsposts(sub_id integer, lim integer, pag integer) RETURNS SETOF public.posts
    LANGUAGE plpgsql
    AS $$
BEGIN 
RETURN QUERY select P.*
FROM follows F 
INNER JOIN Posts P ON P.user_id = F.target_user_id 
WHERE F.subscriber_id = sub_id limit lim offset pag;
END;
$$;
 M   DROP FUNCTION public.followsposts(sub_id integer, lim integer, pag integer);
       public          postgres    false    217         �            1255    32791 %   likedposts(integer, integer, integer)    FUNCTION       CREATE FUNCTION public.likedposts(us_id integer, lim integer, pag integer) RETURNS SETOF public.posts
    LANGUAGE plpgsql
    AS $$
BEGIN
   RETURN QUERY SELECT P.* FROM likes L 
    INNER JOIN posts P ON L.post_id = P.id WHERE L.user_id = us_id limit lim offset pag;
END;
$$;
 J   DROP FUNCTION public.likedposts(us_id integer, lim integer, pag integer);
       public          postgres    false    217         �            1255    24679    profile(character varying)    FUNCTION     :  CREATE FUNCTION public.profile(nic character varying) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $$
DECLARE
    p_id int;
BEGIN
    SELECT id INTO p_id FROM users WHERE nickname = nic;

    RETURN QUERY SELECT * FROM users WHERE id = p_id;
    RETURN QUERY SELECT * FROM posts WHERE user_id = p_id;
END;
$$;
 5   DROP FUNCTION public.profile(nic character varying);
       public          postgres    false         �            1255    40967    recomendusers(integer)    FUNCTION     �  CREATE FUNCTION public.recomendusers(us_id integer) RETURNS TABLE(id integer, nickname character varying, description text, avatar_url character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY SELECT U.id,U.nickname,U.description,U.avatar_url
FROM (
    SELECT U.id, COUNT(*) as count
    FROM follows F
    INNER JOIN follows O on O.subscriber_id = F.target_user_id
    INNER JOIN users U on U.id = O.target_user_id
    WHERE O.target_user_id <> us_id AND F.subscriber_id = us_id
    AND U.id NOT IN (
        SELECT target_user_id
        FROM follows
        WHERE subscriber_id = us_id
    )
    GROUP BY U.id
    ORDER BY count DESC
) AS sub
JOIN users U on U.id = sub.id;
END;
$$;
 3   DROP FUNCTION public.recomendusers(us_id integer);
       public          postgres    false         �            1255    32789 
   setlikes()    FUNCTION     H  CREATE FUNCTION public.setlikes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF(TG_OP = 'INSERT') THEN 
    UPDATE posts SET likes = likes + 1 where posts.id = NEW.post_id;
    ELSIF (TG_OP = 'DELETE') THEN 
    UPDATE posts SET likes = likes - 1 where posts.id = OLD.post_id;
    END IF;
    RETURN NEW;
END;
$$;
 !   DROP FUNCTION public.setlikes();
       public          postgres    false         �            1255    24674    update_follow_count()    FUNCTION     �  CREATE FUNCTION public.update_follow_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users SET followers = followers + 1 WHERE id = NEW.subscriber_id;
    UPDATE users SET following = following + 1 WHERE id = NEW.target_user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users SET followers = followers - 1 WHERE id = OLD.subscriber_id;
    UPDATE users SET following = following - 1 WHERE id = OLD.target_user_id;
  END IF;
  RETURN NULL;
END;
$$;
 ,   DROP FUNCTION public.update_follow_count();
       public          postgres    false         �            1259    24650    follows    TABLE     �   CREATE TABLE public.follows (
    subscriber_id integer,
    target_user_id integer,
    CONSTRAINT follows_check CHECK ((target_user_id <> subscriber_id))
);
    DROP TABLE public.follows;
       public         heap    postgres    false         �            1259    24637    likes    TABLE     H   CREATE TABLE public.likes (
    user_id integer,
    post_id integer
);
    DROP TABLE public.likes;
       public         heap    postgres    false         �            1259    24626    pets    TABLE     �   CREATE TABLE public.pets (
    id integer NOT NULL,
    name character varying(50),
    img_url character varying(255),
    user_id integer
);
    DROP TABLE public.pets;
       public         heap    postgres    false         �            1259    24625    pets_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.pets_id_seq;
       public          postgres    false    219         3           0    0    pets_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.pets_id_seq OWNED BY public.pets.id;
          public          postgres    false    218         �            1259    24610    posts_id_seq    SEQUENCE     �   CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.posts_id_seq;
       public          postgres    false    217         4           0    0    posts_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;
          public          postgres    false    216         �            1259    24598    users    TABLE     f  CREATE TABLE public.users (
    id integer NOT NULL,
    nickname character varying(20),
    name character varying(50),
    description text,
    followers integer DEFAULT 0,
    following integer DEFAULT 0,
    avatar_url character varying(255),
    back_url character varying(255),
    email character varying(100),
    password character varying(255)
);
    DROP TABLE public.users;
       public         heap    postgres    false         �            1259    24597    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    215         5           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    214         �           2604    24629    pets id    DEFAULT     b   ALTER TABLE ONLY public.pets ALTER COLUMN id SET DEFAULT nextval('public.pets_id_seq'::regclass);
 6   ALTER TABLE public.pets ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    219    219         �           2604    24614    posts id    DEFAULT     d   ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);
 7   ALTER TABLE public.posts ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216    217         }           2604    24601    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215         ,          0    24650    follows 
   TABLE DATA                 public          postgres    false    221       3372.dat +          0    24637    likes 
   TABLE DATA                 public          postgres    false    220       3371.dat *          0    24626    pets 
   TABLE DATA                 public          postgres    false    219       3370.dat (          0    24611    posts 
   TABLE DATA                 public          postgres    false    217       3368.dat &          0    24598    users 
   TABLE DATA                 public          postgres    false    215       3366.dat 6           0    0    pets_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.pets_id_seq', 1, true);
          public          postgres    false    218         7           0    0    posts_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.posts_id_seq', 15, true);
          public          postgres    false    216         8           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 10, true);
          public          postgres    false    214         �           2606    24631    pets pets_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.pets
    ADD CONSTRAINT pets_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.pets DROP CONSTRAINT pets_pkey;
       public            postgres    false    219         �           2606    24619    posts posts_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pkey;
       public            postgres    false    217         �           2606    24609    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    215         �           2606    24607    users users_nickname_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_nickname_key UNIQUE (nickname);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_nickname_key;
       public            postgres    false    215         �           2606    24605    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    215         �           2620    24675    follows follows_trigger    TRIGGER     �   CREATE TRIGGER follows_trigger AFTER INSERT OR DELETE ON public.follows FOR EACH ROW EXECUTE FUNCTION public.update_follow_count();
 0   DROP TRIGGER follows_trigger ON public.follows;
       public          postgres    false    222    221         �           2620    32790    likes set_likes    TRIGGER     q   CREATE TRIGGER set_likes AFTER INSERT OR DELETE ON public.likes FOR EACH ROW EXECUTE FUNCTION public.setlikes();
 (   DROP TRIGGER set_likes ON public.likes;
       public          postgres    false    224    220         �           2606    24654 "   follows follows_subscriber_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_subscriber_id_fkey FOREIGN KEY (subscriber_id) REFERENCES public.users(id);
 L   ALTER TABLE ONLY public.follows DROP CONSTRAINT follows_subscriber_id_fkey;
       public          postgres    false    215    3210    221         �           2606    24659 #   follows follows_target_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id);
 M   ALTER TABLE ONLY public.follows DROP CONSTRAINT follows_target_user_id_fkey;
       public          postgres    false    215    3210    221         �           2606    24645    likes likes_post_id_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);
 B   ALTER TABLE ONLY public.likes DROP CONSTRAINT likes_post_id_fkey;
       public          postgres    false    217    3212    220         �           2606    24640    likes likes_user_id_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 B   ALTER TABLE ONLY public.likes DROP CONSTRAINT likes_user_id_fkey;
       public          postgres    false    220    3210    215         �           2606    24632    pets pets_user_id_fkey    FK CONSTRAINT     u   ALTER TABLE ONLY public.pets
    ADD CONSTRAINT pets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 @   ALTER TABLE ONLY public.pets DROP CONSTRAINT pets_user_id_fkey;
       public          postgres    false    215    3210    219         �           2606    24620    posts posts_user_id_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 B   ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_user_id_fkey;
       public          postgres    false    3210    217    215                       3372.dat                                                                                            0000600 0004000 0002000 00000001466 14445310757 0014271 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        INSERT INTO public.follows (subscriber_id, target_user_id) VALUES (1, 10);
INSERT INTO public.follows (subscriber_id, target_user_id) VALUES (10, 1);
INSERT INTO public.follows (subscriber_id, target_user_id) VALUES (9, 2);
INSERT INTO public.follows (subscriber_id, target_user_id) VALUES (10, 2);
INSERT INTO public.follows (subscriber_id, target_user_id) VALUES (1, 2);
INSERT INTO public.follows (subscriber_id, target_user_id) VALUES (2, 9);
INSERT INTO public.follows (subscriber_id, target_user_id) VALUES (2, 10);
INSERT INTO public.follows (subscriber_id, target_user_id) VALUES (2, 1);
INSERT INTO public.follows (subscriber_id, target_user_id) VALUES (9, 10);
INSERT INTO public.follows (subscriber_id, target_user_id) VALUES (1, 9);
INSERT INTO public.follows (subscriber_id, target_user_id) VALUES (10, 9);


                                                                                                                                                                                                          3371.dat                                                                                            0000600 0004000 0002000 00000000454 14445310757 0014264 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        INSERT INTO public.likes (user_id, post_id) VALUES (1, 2);
INSERT INTO public.likes (user_id, post_id) VALUES (10, 2);
INSERT INTO public.likes (user_id, post_id) VALUES (2, 8);
INSERT INTO public.likes (user_id, post_id) VALUES (10, 7);
INSERT INTO public.likes (user_id, post_id) VALUES (10, 6);


                                                                                                                                                                                                                    3370.dat                                                                                            0000600 0004000 0002000 00000000177 14445310757 0014265 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        INSERT INTO public.pets (id, name, img_url, user_id) VALUES (1, NULL, 'imgStorage\2023-06-23T12-23-01.152Z-pet-10.png', 10);


                                                                                                                                                                                                                                                                                                                                                                                                 3368.dat                                                                                            0000600 0004000 0002000 00000005101 14445310757 0014264 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (1, 'buy a car', 'i have bought a car', 0, '2023-06-03 18:22:01.404368', 'awdawdawd', 1);
INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (3, 'awdqwe', 'dgdrghkuhj', 0, '2023-06-08 22:09:25.651411', 'sefsexvxdv', 2);
INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (4, 'awdqwe', 'dgdrghkuhj', 0, '2023-06-08 22:09:44.710942', 'sefsexvxdv', 2);
INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (5, 'awdqwe', 'dgdrghkuhj', 0, '2023-06-08 22:09:48.200392', 'sefsexvxdv', 10);
INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (2, 'awdawd', 'dhgdrgrdg', 2, '2023-06-03 18:45:49.532576', 'awdawdawdadawd', 1);
INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (8, 'awdqwe', 'dgdrghkuhj', 1, '2023-06-08 22:10:08.07532', 'sefsexvxdv', 9);
INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (7, 'awdqwe', 'dgdrghkuhj', 1, '2023-06-08 22:10:04.179752', 'sefsexvxdv', 9);
INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (6, 'awdqwe', 'dgdrghkuhj', 1, '2023-06-08 22:09:52.11553', 'sefsexvxdv', 10);
INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (9, 'srgsrgseg', 'fhdrgrgdrg', 0, '2023-06-21 14:52:56.391189', NULL, 10);
INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (10, 'srgsrgawdawdseg', 'fhdrgrawdawdgdrg', 0, '2023-06-21 14:55:08.274519', '10', NULL);
INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (11, 'srgsrgawdawdseg', 'fhdrgrawdawdgdrg', 0, '2023-06-21 14:56:13.808434', NULL, 10);
INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (12, 'srgsrgawdawdseg', 'fhdrgrawdawdgdrg', 0, '2023-06-21 14:56:43.208092', '', 10);
INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (13, 'srgsrgawdawdseg', 'fhdrgrawdawdgdrg', 0, '2023-06-21 14:57:12.646026', NULL, 10);
INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (14, 'srgsrgawdawddddseg', 'fhdrgradddwdawdgdrg', 0, '2023-06-21 14:58:30.97602', NULL, 10);
INSERT INTO public.posts (id, title, description, likes, "time", img_url, user_id) VALUES (15, NULL, NULL, 0, '2023-06-21 14:58:39.770972', 'imgStorage\2023-06-21T12-58-39.747Z-post-10.jpeg', 10);


                                                                                                                                                                                                                                                                                                                                                                                                                                                               3366.dat                                                                                            0000600 0004000 0002000 00000002040 14445310757 0014261 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        INSERT INTO public.users (id, nickname, name, description, followers, following, avatar_url, back_url, email, password) VALUES (10, 'illia', 'illia', 'qwedddere', 3, 3, 'imgStorage\2023-06-23T11-48-02.853Z-avatar-10.jpeg', 'imgStorage\2023-06-21T13-36-26.857Z-avatar-10.jpeg', 'illia@gmail.com', '$2b$05$T42IpJydWB.YVuR4eSyQNud/UseEfdlSKuzCk.IdWYKRAvWr1V2Rm');
INSERT INTO public.users (id, nickname, name, description, followers, following, avatar_url, back_url, email, password) VALUES (2, 'aboba', 'aboba', 'adawd', 3, 3, 'awdawd', 'khawbdkawd123', 'aboba@gmail.com', 'jkadnkw654');
INSERT INTO public.users (id, nickname, name, description, followers, following, avatar_url, back_url, email, password) VALUES (1, 'oleg', 'oleg', 'adawd', 3, 2, 'awdawd', 'khawbdkawd123', 'oleg@gmail.com', 'jkadnkw654');
INSERT INTO public.users (id, nickname, name, description, followers, following, avatar_url, back_url, email, password) VALUES (9, 'awdawd', NULL, NULL, 2, 3, NULL, NULL, 'awdawd', '$2b$05$6sG1H.jGXfp4b463955XN.ikw4nAlILDDvWoAWWZpgR2nSVYqckAC');


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                restore.sql                                                                                         0000600 0004000 0002000 00000026664 14445310757 0015414 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

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

DROP DATABASE socialnetwork;
--
-- Name: socialnetwork; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE socialnetwork WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


ALTER DATABASE socialnetwork OWNER TO postgres;

\connect socialnetwork

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    title character varying(25),
    description character varying(255),
    likes integer DEFAULT 0,
    "time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    img_url character varying(255),
    user_id integer
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: followsposts(integer, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.followsposts(sub_id integer, lim integer, pag integer) RETURNS SETOF public.posts
    LANGUAGE plpgsql
    AS $$
BEGIN 
RETURN QUERY select P.*
FROM follows F 
INNER JOIN Posts P ON P.user_id = F.target_user_id 
WHERE F.subscriber_id = sub_id limit lim offset pag;
END;
$$;


ALTER FUNCTION public.followsposts(sub_id integer, lim integer, pag integer) OWNER TO postgres;

--
-- Name: likedposts(integer, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.likedposts(us_id integer, lim integer, pag integer) RETURNS SETOF public.posts
    LANGUAGE plpgsql
    AS $$
BEGIN
   RETURN QUERY SELECT P.* FROM likes L 
    INNER JOIN posts P ON L.post_id = P.id WHERE L.user_id = us_id limit lim offset pag;
END;
$$;


ALTER FUNCTION public.likedposts(us_id integer, lim integer, pag integer) OWNER TO postgres;

--
-- Name: profile(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.profile(nic character varying) RETURNS SETOF record
    LANGUAGE plpgsql
    AS $$
DECLARE
    p_id int;
BEGIN
    SELECT id INTO p_id FROM users WHERE nickname = nic;

    RETURN QUERY SELECT * FROM users WHERE id = p_id;
    RETURN QUERY SELECT * FROM posts WHERE user_id = p_id;
END;
$$;


ALTER FUNCTION public.profile(nic character varying) OWNER TO postgres;

--
-- Name: recomendusers(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.recomendusers(us_id integer) RETURNS TABLE(id integer, nickname character varying, description text, avatar_url character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY SELECT U.id,U.nickname,U.description,U.avatar_url
FROM (
    SELECT U.id, COUNT(*) as count
    FROM follows F
    INNER JOIN follows O on O.subscriber_id = F.target_user_id
    INNER JOIN users U on U.id = O.target_user_id
    WHERE O.target_user_id <> us_id AND F.subscriber_id = us_id
    AND U.id NOT IN (
        SELECT target_user_id
        FROM follows
        WHERE subscriber_id = us_id
    )
    GROUP BY U.id
    ORDER BY count DESC
) AS sub
JOIN users U on U.id = sub.id;
END;
$$;


ALTER FUNCTION public.recomendusers(us_id integer) OWNER TO postgres;

--
-- Name: setlikes(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.setlikes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF(TG_OP = 'INSERT') THEN 
    UPDATE posts SET likes = likes + 1 where posts.id = NEW.post_id;
    ELSIF (TG_OP = 'DELETE') THEN 
    UPDATE posts SET likes = likes - 1 where posts.id = OLD.post_id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.setlikes() OWNER TO postgres;

--
-- Name: update_follow_count(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_follow_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users SET followers = followers + 1 WHERE id = NEW.subscriber_id;
    UPDATE users SET following = following + 1 WHERE id = NEW.target_user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users SET followers = followers - 1 WHERE id = OLD.subscriber_id;
    UPDATE users SET following = following - 1 WHERE id = OLD.target_user_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION public.update_follow_count() OWNER TO postgres;

--
-- Name: follows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.follows (
    subscriber_id integer,
    target_user_id integer,
    CONSTRAINT follows_check CHECK ((target_user_id <> subscriber_id))
);


ALTER TABLE public.follows OWNER TO postgres;

--
-- Name: likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.likes (
    user_id integer,
    post_id integer
);


ALTER TABLE public.likes OWNER TO postgres;

--
-- Name: pets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pets (
    id integer NOT NULL,
    name character varying(50),
    img_url character varying(255),
    user_id integer
);


ALTER TABLE public.pets OWNER TO postgres;

--
-- Name: pets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pets_id_seq OWNER TO postgres;

--
-- Name: pets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pets_id_seq OWNED BY public.pets.id;


--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posts_id_seq OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nickname character varying(20),
    name character varying(50),
    description text,
    followers integer DEFAULT 0,
    following integer DEFAULT 0,
    avatar_url character varying(255),
    back_url character varying(255),
    email character varying(100),
    password character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: pets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pets ALTER COLUMN id SET DEFAULT nextval('public.pets_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: postgres
--

\i $$PATH$$/3372.dat

--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

\i $$PATH$$/3371.dat

--
-- Data for Name: pets; Type: TABLE DATA; Schema: public; Owner: postgres
--

\i $$PATH$$/3370.dat

--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

\i $$PATH$$/3368.dat

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

\i $$PATH$$/3366.dat

--
-- Name: pets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pets_id_seq', 1, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 15, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- Name: pets pets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pets
    ADD CONSTRAINT pets_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_nickname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_nickname_key UNIQUE (nickname);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: follows follows_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER follows_trigger AFTER INSERT OR DELETE ON public.follows FOR EACH ROW EXECUTE FUNCTION public.update_follow_count();


--
-- Name: likes set_likes; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_likes AFTER INSERT OR DELETE ON public.likes FOR EACH ROW EXECUTE FUNCTION public.setlikes();


--
-- Name: follows follows_subscriber_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_subscriber_id_fkey FOREIGN KEY (subscriber_id) REFERENCES public.users(id);


--
-- Name: follows follows_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id);


--
-- Name: likes likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: likes likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: pets pets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pets
    ADD CONSTRAINT pets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            