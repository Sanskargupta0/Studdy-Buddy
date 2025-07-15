import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'system-ui',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 30,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  fontSize: 60,
                  fontWeight: 'bold',
                  color: '#667eea',
                }}
              >
                SB
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <h1
                style={{
                  fontSize: 72,
                  fontWeight: 'bold',
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                StuddyBuddy
              </h1>
              <p
                style={{
                  fontSize: 28,
                  color: '#ffffff',
                  opacity: 0.9,
                  margin: 0,
                  marginTop: 10,
                }}
              >
                AI-Powered Study Material Generator
              </p>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '20px 40px',
              borderRadius: 20,
              backdropFilter: 'blur(10px)',
            }}
          >
            <p
              style={{
                fontSize: 24,
                color: '#ffffff',
                margin: 0,
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              📚 Create personalized flashcards, notes & quizzes with AI
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
