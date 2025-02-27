package Lawyerai.Lawyer_ai.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Base64;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET_KEY;

    //생성자 주입을 통해 프로퍼티 값을 확실히 받아옵니다
    public JwtUtil(@Value("${jwt.secret}") String secretKey) {
        this.SECRET_KEY = secretKey;
    }

    // 서명 키를 안전하게 생성하는 메서드
    private SecretKey getSigningKey() {
        if (SECRET_KEY == null) {
            throw new IllegalStateException("서명키를 불러오는데 실패하였습니다. 프로퍼티 파일을 확인해 주세요.");
        }
        try {
            System.out.println("[getSigningKey] 사용된 SECRET_KEY: \" + SECRET_KEY");
            byte[] keyBytes = Base64.getDecoder().decode(SECRET_KEY);
            System.out.println("[getSigningKey] SECRET_KEY 길이 (디코딩 후): \" + keyBytes.length");
            if (keyBytes.length < 32) {
                throw new IllegalArgumentException("JWT 서명키는 적어도 256비트 여야 합니다.");
            }
            return  new SecretKeySpec(keyBytes, "HmacSHA256");
        } catch(IllegalArgumentException e) {
            System.err.println("❌ SECRET_KEY Base64 디코딩 오류: " + e.getMessage());
            throw e;
        }
    }

    // JWT 토큰 생성
    public String generateToken(String username) {
        System.out.println("🔹 [JWT 생성] 사용된 SECRET_KEY: " + SECRET_KEY);
        return Jwts.builder()
                .setSubject(username) // 사용자 이름 저장
                .setIssuedAt(new Date()) // 발급 시간
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10시간 유효
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // 서명 알고리즘 적용
                .compact();
    }

    // JWT 토큰에서 사용자 이름 추출
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // JWT 토큰의 만료 여부 확인
    public boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    // UserDetails 기반 JWT 유효성 검사
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // JWT Claims(페이로드) 추출
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

