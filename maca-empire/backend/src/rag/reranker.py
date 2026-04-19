class Reranker:
    def __init__(self, threshold: float = 0.65):
        self.threshold = threshold

    def rerank(self, chunks: list, top_k: int = 5) -> list:
        # Filter by similarity
        filtered = [c for c in chunks if c.get('similarity', 0) >= self.threshold]
        
        # Sort by similarity DESC
        sorted_chunks = sorted(filtered, key=lambda x: x.get('similarity', 0), reverse=True)
        
        return sorted_chunks[:top_k]
