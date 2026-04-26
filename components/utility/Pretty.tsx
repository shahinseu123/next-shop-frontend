export const Pretty = ({data}: any) => {
    return (
        <div>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto",
              fontSize: "14px",
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
    )
}