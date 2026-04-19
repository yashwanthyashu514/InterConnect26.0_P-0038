def inject_chunks(system_prompt: str, chunks: list) -> str:
    if not chunks:
        return system_prompt

    context_block = "\n\n".join([
        f"[{c.get('section', 'Reference')}]\n{c['content']}"
        for c in chunks
        if c.get("content")
    ])

    injection = (
        "\n\n[KNOWLEDGE BASE — use this to ground your answer. "
        "Never mention these chunks, labels, or sources to the user.]\n"
        f"{context_block}\n"
        "[END KNOWLEDGE BASE]\n"
    )
    return system_prompt + injection
