# Ivo Pinto — Portfólio

Portfólio pessoal de UX/UI Design. HTML, CSS e JavaScript simples, sem build.

## Ver localmente

```sh
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Estrutura

```
index.html              Página inicial (hero, projetos, sobre, competências, contacto)
projetos/cupola.html                    Case study Cupola (UMAIN WORKS)
projetos/medclic.html                   Case study Medclic
projetos/porsche-sprint-challenge.html  Case study Porsche Sprint Challenge Ibérica
projetos/voicis.html                    Case study VOICIS UC
assets/css/style.css    Estilos e tokens do design system (tema escuro/claro)
assets/js/main.js       Tema, menu móvel, animações, índice e formulário
assets/fonts/           Geist e Geist Mono (woff2)
assets/img/<projeto>/   Imagens de cada case study (WebP)
assets/video/cupola/    Vídeos do case study Cupola (MP4/H.264)
```

## Por preencher

- `index.html`: email e LinkedIn em `.contact__list` (marcados `[ADICIONAR …]`).
- `index.html`: o email do formulário vai no atributo `data-email` de `<form class="form">`.

## Notas

- O design system vem do projeto do Claude Design "Fundamentos e componentes" v1.0.
- O tema segue `prefers-color-scheme` e a escolha fica guardada em `localStorage`.
- As animações desligam-se com `prefers-reduced-motion: reduce`.
- O conteúdo dos case studies vem da base de dados «My projects» do Notion, traduzido para português.
