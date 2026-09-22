import dns from 'dns';

// Some Windows networks reset IPv6 connections to TMDB.
// Prefer IPv4 so discover/search/details calls stay reliable.
dns.setDefaultResultOrder('ipv4first');
